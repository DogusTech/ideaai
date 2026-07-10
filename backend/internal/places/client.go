package places

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"togetlink-api/internal/config"
)

const baseURL = "https://places.googleapis.com/v1"

type Client struct {
	httpClient *http.Client
	apiKey     string
}

func NewClient(cfg *config.Config) *Client {
	return &Client{
		httpClient: &http.Client{Timeout: 15 * time.Second},
		apiKey:     cfg.GooglePlacesAPIKey,
	}
}

func (c *Client) SearchText(ctx context.Context, query string, limit int) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/places:searchText", baseURL)
	
	payload := map[string]interface{}{
		"textQuery": query,
		"pageSize":  limit,
	}
	body, _ := json.Marshal(payload)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-Api-Key", c.apiKey)
	req.Header.Set("X-Goog-FieldMask", "places.id,places.name,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.googleMapsUri,places.primaryType,places.types")

	return c.doReq(req)
}

func (c *Client) PlaceDetails(ctx context.Context, placeID string) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/places/%s", baseURL, placeID)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-Goog-Api-Key", c.apiKey)
	req.Header.Set("X-Goog-FieldMask", "id,name,displayName,formattedAddress,location,rating,userRatingCount,photos,googleMapsUri,regularOpeningHours,primaryType,types,websiteUri,nationalPhoneNumber")

	return c.doReq(req)
}

func (c *Client) doReq(req *http.Request) (map[string]interface{}, error) {
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("places API error: %d %s", resp.StatusCode, string(bodyBytes))
	}

	var res map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	return res, nil
}
