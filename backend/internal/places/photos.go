package places

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"togetlink-api/internal/config"
	"togetlink-api/internal/models"
)

type PhotoResolver struct {
	httpClient *http.Client
	apiKey     string
}

func NewPhotoResolver(cfg *config.Config) *PhotoResolver {
	return &PhotoResolver{
		httpClient: &http.Client{Timeout: 10 * time.Second},
		apiKey:     cfg.GooglePlacesAPIKey,
	}
}

// Resolve fetches the true URI for a Google Place Photo via skipHttpRedirect=true
func (r *PhotoResolver) Resolve(ctx context.Context, photoName string, maxWidth, maxHeight int) (*models.PlacePhoto, error) {
	if !strings.HasPrefix(photoName, "places/") || !strings.Contains(photoName, "/photos/") {
		return nil, fmt.Errorf("invalid photoName format")
	}

	url := fmt.Sprintf("%s/%s/media?skipHttpRedirect=true&key=%s", baseURL, photoName, r.apiKey)
	
	if maxWidth > 0 && maxWidth <= 4800 {
		url += fmt.Sprintf("&maxWidthPx=%d", maxWidth)
	} else {
		url += "&maxWidthPx=1200" // fallback
	}
	
	if maxHeight > 0 && maxHeight <= 4800 {
		url += fmt.Sprintf("&maxHeightPx=%d", maxHeight)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, fmt.Errorf("rate limited by Google Places")
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("failed to resolve photo, status: %d", resp.StatusCode)
	}

	var res struct {
		PhotoURI string `json:"photoUri"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}
	
	if res.PhotoURI == "" {
		return nil, fmt.Errorf("empty photoUri returned")
	}

	return &models.PlacePhoto{
		Name:      photoName,
		PhotoURI:  res.PhotoURI,
		Source:    "google_places",
		ExpiresAt: time.Now().Add(30 * time.Minute).UTC().Format(time.RFC3339),
	}, nil
}
