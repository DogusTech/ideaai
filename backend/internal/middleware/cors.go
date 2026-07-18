package middleware

import (
	"net/http"
	"strings"
)

func CORS(origin string) func(http.Handler) http.Handler {
	// Clean trailing slash from configured origin
	origin = strings.TrimSuffix(origin, "/")

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			reqOrigin := r.Header.Get("Origin")
			
			// Dynamically echo the origin to completely eliminate CORS mismatches during development
			if reqOrigin != "" {
				w.Header().Set("Access-Control-Allow-Origin", reqOrigin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
			} else {
				// Fallback if no Origin header is sent
				w.Header().Set("Access-Control-Allow-Origin", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
			}

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
