package places

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"togetlink-api/internal/config"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/models"
)

type Handlers struct {
	client   *Client
	resolver *PhotoResolver
	cache    *Cache
}

func NewHandlers(cfg *config.Config, fs *firestore.Client) *Handlers {
	return &Handlers{
		client:   NewClient(cfg),
		resolver: NewPhotoResolver(cfg),
		cache:    NewCache(fs, cfg),
	}
}

func (h *Handlers) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if q == "" {
		httpx.Error(w, http.StatusBadRequest, "query 'q' is required")
		return
	}

	limit := 10
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 20 {
			limit = parsed
		}
	}

	raw, err := h.client.SearchText(r.Context(), q, limit)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "failed to call Google Places: "+err.Error())
		return
	}

	var results []interface{}
	if placesRaw, ok := raw["places"].([]interface{}); ok {
		for _, p := range placesRaw {
			if pm, ok := p.(map[string]interface{}); ok {
				// We don't cache search results permanently, just return them mapped
				pc := MapToPlaceCache(pm, time.Now().Add(1*time.Hour))
				results = append(results, pc)
			}
		}
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"places": results})
}

func (h *Handlers) Photo(w http.ResponseWriter, r *http.Request) {
	photoName := r.URL.Query().Get("photoName")
	if photoName == "" {
		httpx.Error(w, http.StatusBadRequest, "photoName is required")
		return
	}

	maxWidth, _ := strconv.Atoi(r.URL.Query().Get("maxWidthPx"))
	maxHeight, _ := strconv.Atoi(r.URL.Query().Get("maxHeightPx"))

	photo, err := h.resolver.Resolve(r.Context(), photoName, maxWidth, maxHeight)
	if err != nil {
		if err.Error() == "rate limited by Google Places" {
			httpx.Error(w, http.StatusTooManyRequests, err.Error())
			return
		}
		httpx.Error(w, http.StatusBadGateway, "failed to resolve photo: "+err.Error())
		return
	}

	httpx.JSON(w, http.StatusOK, photo)
}

func (h *Handlers) RedirectPhoto(w http.ResponseWriter, r *http.Request) {
	photoName := r.URL.Query().Get("photoName")
	if photoName == "" {
		http.Error(w, "photoName is required", http.StatusBadRequest)
		return
	}

	maxWidth, _ := strconv.Atoi(r.URL.Query().Get("maxWidthPx"))
	maxHeight, _ := strconv.Atoi(r.URL.Query().Get("maxHeightPx"))

	photo, err := h.resolver.Resolve(r.Context(), photoName, maxWidth, maxHeight)
	if err != nil {
		http.Error(w, "failed to resolve photo: "+err.Error(), http.StatusBadGateway)
		return
	}

	http.Redirect(w, r, photo.PhotoURI, http.StatusFound)
}

func (h *Handlers) Sync(w http.ResponseWriter, r *http.Request) {
	// Simplified auth check for demo, in real app check Admin role
	
	var req struct {
		PlaceID    string   `json:"placeId"`
		Category   string   `json:"category"`
		City       string   `json:"city"`
		Country    string   `json:"country"`
		BroadAreas []string `json:"broadAreas"`
		Visibility string   `json:"visibility"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// 1. Fetch from Google
	raw, err := h.client.PlaceDetails(r.Context(), req.PlaceID)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "google places failed: "+err.Error())
		return
	}

	// 2. Map cache
	pc := MapToPlaceCache(raw, time.Now().Add(time.Duration(h.cache.ttl)))
	if err := h.cache.Set(r.Context(), pc); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to cache place: "+err.Error())
		return
	}

	// 3. Create Hub
	hub := models.Hub{
		ID:               pc.PlaceID, // simple 1:1 for now
		PlaceID:          pc.PlaceID,
		ResourceName:     pc.ResourceName,
		Slug:             strings.ToLower("hub-" + pc.PlaceID), // simplistic
		Name:             pc.DisplayName,
		NormalizedName:   strings.ToLower(pc.DisplayName),
		Category:         req.Category,
		City:             req.City,
		Country:          req.Country,
		FormattedAddress: pc.FormattedAddress,
		GoogleMapsURI:    pc.GoogleMapsURI,
		Location:         pc.Location,
		Rating:           pc.Rating,
		UserRatingCount:  pc.UserRatingCount,
		Photos:           pc.Photos,
		BroadAreas:       req.BroadAreas,
		Tags:             []string{},
		Source:           "google_places",
		Visibility:       req.Visibility,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}

	now := time.Now().UTC()
	hub.LastPlacesSyncAt = &now

	if len(pc.Photos) > 0 {
		hub.CardPhoto = &pc.Photos[0]
		hub.HeroPhoto = &pc.Photos[0]
	}

	_, err = h.cache.client.Collection("hubs").Doc(hub.ID).Set(r.Context(), hub)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to save hub")
		return
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"status": "success", "hub": hub})
}

func (h *Handlers) Seed(w http.ResponseWriter, r *http.Request) {
	// Not fully implemented for safety: would iterate over the hardcoded list
	httpx.JSON(w, http.StatusOK, map[string]interface{}{"status": "seed triggered (mock implementation)"})
}
