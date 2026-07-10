package checkins

import (
	"encoding/json"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"togetlink-api/internal/middleware"
)

type Handlers struct {
	FS *firestore.Client
}

func NewHandlers(fs *firestore.Client) *Handlers {
	return &Handlers{FS: fs}
}

// GET /api/checkins/me
func (h *Handlers) Me(w http.ResponseWriter, r *http.Request) {
	uid, ok := r.Context().Value(middleware.UIDKey).(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	iter := h.FS.Collection("checkins").Where("uid", "==", uid).Documents(r.Context())
	var checkins []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to fetch checkins", http.StatusInternalServerError)
			return
		}
		data := doc.Data()
		data["id"] = doc.Ref.ID
		checkins = append(checkins, data)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(checkins)
}
