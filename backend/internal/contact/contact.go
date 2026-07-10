package contact

import (
	"encoding/json"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
)

type Handlers struct {
	FS *firestore.Client
}

func NewHandlers(fs *firestore.Client) *Handlers {
	return &Handlers{FS: fs}
}

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

// POST /api/contact
func (h *Handlers) Submit(w http.ResponseWriter, r *http.Request) {
	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Email == "" || req.Message == "" {
		http.Error(w, "Name, email, and message are required", http.StatusBadRequest)
		return
	}

	doc := map[string]interface{}{
		"name":      req.Name,
		"email":     req.Email,
		"subject":   req.Subject,
		"message":   req.Message,
		"createdAt": firestore.ServerTimestamp,
		"status":    "new",
	}

	_, _, err := h.FS.Collection("contactMessages").Add(r.Context(), doc)
	if err != nil {
		http.Error(w, "Failed to submit message", http.StatusInternalServerError)
		return
	}

	// We sleep minimally to deter timing attacks if we were sending emails, 
	// but here we just return success.
	time.Sleep(200 * time.Millisecond)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "success",
		"message": "Your message has been received. Our team will review it.",
	})
}
