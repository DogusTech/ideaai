package server

import (
	"net/http"
	
	"firebase.google.com/go/v4/auth"
	"cloud.google.com/go/firestore"
	
	"togetlink-api/internal/config"
	"togetlink-api/internal/middleware"
	internalauth "togetlink-api/internal/auth"
	internalcheckins "togetlink-api/internal/checkins"
	internalcontact "togetlink-api/internal/contact"
	internalhubs "togetlink-api/internal/hubs"
	internallanding "togetlink-api/internal/landing"
	internaldashboard "togetlink-api/internal/dashboard"
	internalplaces "togetlink-api/internal/places"
)

func New(cfg *config.Config, authClient *auth.Client, firestoreClient *firestore.Client) http.Handler {
	mux := http.NewServeMux()

	authHandlers := internalauth.NewHandlers(authClient)
	hubHandlers := internalhubs.NewHandlers(firestoreClient, cfg)
	checkinHandlers := internalcheckins.NewHandlers(firestoreClient)
	contactHandlers := internalcontact.NewHandlers(firestoreClient)
	landingHandlers := internallanding.NewHandlers(firestoreClient, cfg)
	dashboardHandlers := internaldashboard.NewHandlers(firestoreClient, cfg)
	placesHandlers := internalplaces.NewHandlers(cfg, firestoreClient)

	requireAuth := middleware.RequireAuth(authClient)

	// Health and Auth
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ready")) })
	
	mux.HandleFunc("GET /api/auth/csrf", authHandlers.CSRF)
	mux.Handle("POST /api/auth/session", middleware.RateLimit(http.HandlerFunc(authHandlers.Session)))
	mux.HandleFunc("POST /api/auth/logout", authHandlers.Logout)
	mux.Handle("GET /api/auth/me", requireAuth(http.HandlerFunc(authHandlers.Me)))

	// Landing & Dashboard
	mux.HandleFunc("GET /api/landing/venues", landingHandlers.Venues)
	mux.HandleFunc("GET /api/dashboard/hubs", dashboardHandlers.RecommendedHubs)

	// Places API
	mux.Handle("GET /api/places/search", middleware.RateLimit(http.HandlerFunc(placesHandlers.Search)))
	mux.Handle("GET /api/places/photo", middleware.RateLimit(http.HandlerFunc(placesHandlers.Photo)))
	mux.Handle("GET /api/places/photo/redirect", middleware.RateLimit(http.HandlerFunc(placesHandlers.RedirectPhoto)))
	
	// Admin (Protected by RequireAuth in production)
	mux.Handle("POST /api/places/sync", requireAuth(http.HandlerFunc(placesHandlers.Sync)))
	mux.Handle("POST /api/admin/seed-hubs", requireAuth(http.HandlerFunc(placesHandlers.Seed)))

	// Hubs
	mux.HandleFunc("GET /api/hubs", hubHandlers.List)
	mux.HandleFunc("GET /api/hubs/by-slug", hubHandlers.BySlug)
	mux.HandleFunc("GET /api/hubs/{hubId}", hubHandlers.Detail)

	// Checkins
	mux.Handle("GET /api/checkins/me", requireAuth(http.HandlerFunc(checkinHandlers.Me)))

	// Contact
	mux.Handle("POST /api/contact", middleware.RateLimit(http.HandlerFunc(contactHandlers.Submit)))

	// Global Middlewares
	var handler http.Handler = mux
	handler = middleware.RateLimit(handler)
	handler = middleware.SecurityHeaders(handler)
	handler = middleware.RequestID(handler)
	handler = middleware.CORS(cfg.AppOrigin)(handler)
	handler = middleware.Recovery(handler)

	return handler
}
