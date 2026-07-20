package users

import (
	"encoding/json"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"togetlink-api/internal/httpx"
	"togetlink-api/internal/middleware"
)

type Handlers struct {
	fs   *firestore.Client
	auth *auth.Client
}

func NewHandlers(fs *firestore.Client, auth *auth.Client) *Handlers {
	return &Handlers{
		fs:   fs,
		auth: auth,
	}
}

type UserProfile struct {
	UID       string    `json:"uid" firestore:"-"`
	Name      string    `json:"name" firestore:"name"`
	Email     string    `json:"email" firestore:"email"`
	Headline  string    `json:"headline" firestore:"headline"`
	Company   string    `json:"company" firestore:"company"`
	Bio       string    `json:"bio" firestore:"bio"`
	LinkedIn  string    `json:"linkedin" firestore:"linkedin"`
	Website   string    `json:"website" firestore:"website"`
	City      string    `json:"city" firestore:"city"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" firestore:"updatedAt"`
}

// GET /api/users/me
func (h *Handlers) Me(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	doc, err := h.fs.Collection("users").Doc(uid).Get(r.Context())
	var profile UserProfile

	if err != nil {
		// Document might not exist yet if they just registered. We create a stub based on auth token.
		userRecord, err := h.auth.GetUser(r.Context(), uid)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to get auth user")
			return
		}
		profile = UserProfile{
			UID:       uid,
			Name:      userRecord.DisplayName,
			Email:     userRecord.Email,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
	} else {
		if err := doc.DataTo(&profile); err != nil {
			httpx.Error(w, http.StatusInternalServerError, "data parsing error")
			return
		}
		profile.UID = uid
	}

	httpx.JSON(w, http.StatusOK, map[string]interface{}{"profile": profile})
}

// PUT /api/users/me
func (h *Handlers) UpdateMe(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFromContext(r.Context())
	if uid == "" {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		Name     string `json:"name"`
		Headline string `json:"headline"`
		Company  string `json:"company"`
		Bio      string `json:"bio"`
		LinkedIn string `json:"linkedin"`
		Website  string `json:"website"`
		City     string `json:"city"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}

	// Always ensure they have an auth record before writing to Firestore
	userRecord, err := h.auth.GetUser(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "invalid user")
		return
	}

	updateData := []firestore.Update{
		{Path: "name", Value: req.Name},
		{Path: "headline", Value: req.Headline},
		{Path: "company", Value: req.Company},
		{Path: "bio", Value: req.Bio},
		{Path: "linkedin", Value: req.LinkedIn},
		{Path: "website", Value: req.Website},
		{Path: "city", Value: req.City},
		{Path: "updatedAt", Value: time.Now()},
	}

	docRef := h.fs.Collection("users").Doc(uid)
	_, err = docRef.Update(r.Context(), updateData)
	if err != nil {
		// If it fails with NotFound, we Set the document instead.
		profile := UserProfile{
			Name:      req.Name,
			Email:     userRecord.Email,
			Headline:  req.Headline,
			Company:   req.Company,
			Bio:       req.Bio,
			LinkedIn:  req.LinkedIn,
			Website:   req.Website,
			City:      req.City,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		_, err = docRef.Set(r.Context(), profile)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "failed to update profile: "+err.Error())
			return
		}
	}

	httpx.JSON(w, http.StatusOK, map[string]string{"status": "success"})
}
