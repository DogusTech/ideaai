package landing

import (
	"net/http"

	"cloud.google.com/go/firestore"
	"togetlink-api/internal/config"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/hubs"
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

func (h *Handlers) Venues(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	iter := h.fs.Collection("hubs").Where("visibility", "==", "public").Limit(6).Documents(ctx)
	
	venues, err := h.hubsHandlers.FetchHubs(ctx, iter)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to fetch landing venues")
		return
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"venues": venues})
}
