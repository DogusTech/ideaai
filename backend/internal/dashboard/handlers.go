package dashboard

import (
	"net/http"

	"cloud.google.com/go/firestore"
	"togetlink-api/internal/config"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/hubs"
	"togetlink-api/internal/models"
)

type Handlers struct {
	fs           *firestore.Client
	hubsHandlers *hubs.Handlers
}

func NewHandlers(fs *firestore.Client, cfg *config.Config) *Handlers {
	return &Handlers{
		fs:           fs,
		hubsHandlers: hubs.NewHandlers(fs, cfg),
	}
}

func (h *Handlers) RecommendedHubs(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	iter := h.fs.Collection("hubs").Where("visibility", "==", "public").Limit(12).Documents(ctx)
	
	results, err := h.hubsHandlers.FetchHubs(ctx, iter)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to fetch dashboard hubs")
		return
	}

	// Make sure we don't return nil, which breaks the frontend
	if results == nil {
		results = make([]models.Hub, 0)
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"hubs": results})
}
