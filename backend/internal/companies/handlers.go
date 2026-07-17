package companies

import (
	"encoding/json"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/middleware"
)

type Handlers struct {
	fs *firestore.Client
}

func NewHandlers(fs *firestore.Client) *Handlers {
	return &Handlers{fs: fs}
}

type Company struct {
	ID        string    `json:"id" firestore:"-"`
	Name      string    `json:"name" firestore:"name"`
	Website   string    `json:"website" firestore:"website"`
	Industry  string    `json:"industry" firestore:"industry"`
	Size      string    `json:"size" firestore:"size"`
	Admins    []string  `json:"admins" firestore:"admins"` // UIDs of administrators
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
}

// POST /api/companies
func (h *Handlers) Create(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		Name     string `json:"name"`
		Website  string `json:"website"`
		Industry string `json:"industry"`
		Size     string `json:"size"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid request")
		return
	}

	if req.Name == "" || req.Industry == "" {
		httpx.Error(w, http.StatusBadRequest, "name and industry are required")
		return
	}

	company := Company{
		Name:      req.Name,
		Website:   req.Website,
		Industry:  req.Industry,
		Size:      req.Size,
		Admins:    []string{uid},
		CreatedAt: time.Now(),
	}

	ref, _, err := h.fs.Collection("companies").Add(r.Context(), company)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to create company")
		return
	}

	// Update user's profile to reflect they are now an admin/employee of this company
	h.fs.Collection("users").Doc(uid).Update(r.Context(), []firestore.Update{
		{Path: "company", Value: req.Name},
	})

	httpx.JSON(w, http.StatusCreated, map[string]string{"id": ref.ID})
}
