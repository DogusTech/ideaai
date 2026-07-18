package auth

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"firebase.google.com/go/v4/auth"
)

type Handlers struct {
	AuthClient *auth.Client
}

func NewHandlers(client *auth.Client) *Handlers {
	return &Handlers{AuthClient: client}
}

// CSRF Response
type CSRFResponse struct {
	Token string `json:"token"`
}

// GET /api/auth/csrf
func (h *Handlers) CSRF(w http.ResponseWriter, r *http.Request) {
	b := make([]byte, 32)
	rand.Read(b)
	token := base64.URLEncoding.EncodeToString(b)

	// Set CSRF token in a non-HttpOnly cookie so the frontend can read it
	http.SetCookie(w, &http.Cookie{
		Name:     "togetlink_csrf",
		Value:    token,
		Path:     "/",
		MaxAge:   3600, // 1 hour
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		HttpOnly: false,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(CSRFResponse{Token: token})
}

// SessionRequest from frontend containing ID token
type SessionRequest struct {
	IDToken string `json:"idToken"`
}

// POST /api/auth/session
func (h *Handlers) Session(w http.ResponseWriter, r *http.Request) {
	// Verify CSRF
	if !verifyCSRF(r) {
		http.Error(w, "Invalid CSRF Token", http.StatusForbidden)
		return
	}

	var req SessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	expiresIn := time.Hour * 24 * 5 // 5 days

	// Create session cookie
	cookie, err := h.AuthClient.SessionCookie(r.Context(), req.IDToken, expiresIn)
	if err != nil {
		log.Printf("Failed to create session cookie: %v", err)
		http.Error(w, "Failed to create session", http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    cookie,
		MaxAge:   int(expiresIn.Seconds()),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success"}`))
}

// POST /api/auth/logout
func (h *Handlers) Logout(w http.ResponseWriter, r *http.Request) {
	if !verifyCSRF(r) {
		http.Error(w, "Invalid CSRF Token", http.StatusForbidden)
		return
	}

	// Revoke on Firebase side
	cookie, err := r.Cookie("session")
	if err == nil && cookie.Value != "" {
		decoded, err := h.AuthClient.VerifySessionCookieAndCheckRevoked(r.Context(), cookie.Value)
		if err == nil {
			h.AuthClient.RevokeRefreshTokens(r.Context(), decoded.UID)
		}
	}

	// Clear cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success"}`))
}

// GET /api/auth/me
func (h *Handlers) Me(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	token, err := h.AuthClient.VerifySessionCookieAndCheckRevoked(r.Context(), cookie.Value)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := h.AuthClient.GetUser(r.Context(), token.UID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	isAdmin := false
	if claims, ok := user.CustomClaims["admin"]; ok {
		if val, isBool := claims.(bool); isBool {
			isAdmin = val
		}
	}

	response := map[string]interface{}{
		"uid":   user.UID,
		"email": user.Email,
		"name":  user.DisplayName,
		"admin": isAdmin,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func verifyCSRF(r *http.Request) bool {
	cookie, err := r.Cookie("togetlink_csrf")
	if err != nil {
		return false
	}
	headerToken := r.Header.Get("X-CSRF-Token")
	if headerToken == "" || headerToken != cookie.Value {
		return false
	}
	return true
}
