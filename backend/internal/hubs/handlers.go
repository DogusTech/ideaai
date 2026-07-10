package hubs

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"togetlink-api/internal/config"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/models"
	"togetlink-api/internal/places"
)

type Handlers struct {
	fs            *firestore.Client
	photoResolver *places.PhotoResolver
}

func NewHandlers(fs *firestore.Client, cfg *config.Config) *Handlers {
	return &Handlers{
		fs:            fs,
		photoResolver: places.NewPhotoResolver(cfg),
	}
}

func (h *Handlers) List(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	// Example implementation returning hubs
	iter := h.fs.Collection("hubs").Where("visibility", "==", "public").Limit(24).Documents(ctx)
	hubs, err := h.FetchHubs(ctx, iter)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to fetch hubs")
		return
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"hubs": hubs})
}

func (h *Handlers) BySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		httpx.Error(w, http.StatusBadRequest, "slug is required")
		return
	}

	ctx := r.Context()
	iter := h.fs.Collection("hubs").Where("slug", "==", slug).Limit(1).Documents(ctx)
	hubsList, err := h.FetchHubs(ctx, iter)
	if err != nil || len(hubsList) == 0 {
		httpx.Error(w, http.StatusNotFound, "hub not found")
		return
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"hub": hubsList[0]})
}

func (h *Handlers) Detail(w http.ResponseWriter, r *http.Request) {
	hubID := r.PathValue("hubId")
	if hubID == "" {
		httpx.Error(w, http.StatusBadRequest, "hubId is required")
		return
	}

	ctx := r.Context()
	doc, err := h.fs.Collection("hubs").Doc(hubID).Get(ctx)
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "hub not found")
		return
	}

	var hub models.Hub
	if err := doc.DataTo(&hub); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "data error")
		return
	}

	h.resolvePhotos(ctx, &hub)
	httpx.JSON(w, http.StatusOK, map[string]interface{}{"hub": hub})
}

func (h *Handlers) FetchHubs(ctx context.Context, iter *firestore.DocumentIterator) ([]models.Hub, error) {
	var hubs []models.Hub
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var hub models.Hub
		if err := doc.DataTo(&hub); err != nil {
			continue
		}
		
		h.resolvePhotos(ctx, &hub)
		hubs = append(hubs, hub)
	}
	return hubs, nil
}

func (h *Handlers) resolvePhotos(ctx context.Context, hub *models.Hub) {
	// Simple resolution logic for the primary card photo
	var targetPhoto *models.PlacePhoto
	if hub.CardPhoto != nil {
		targetPhoto = hub.CardPhoto
	} else if hub.HeroPhoto != nil {
		targetPhoto = hub.HeroPhoto
	} else if len(hub.Photos) > 0 {
		targetPhoto = &hub.Photos[0]
	}

	if targetPhoto != nil && targetPhoto.Name != "" {
		// Attempt resolution (in production, we'd batch or cache this aggressively)
		resolved, err := h.photoResolver.Resolve(ctx, targetPhoto.Name, 1200, 800)
		if err == nil && resolved != nil {
			hub.Photo = resolved
			hub.Photo.AuthorAttributions = targetPhoto.AuthorAttributions
		}
	}
}
