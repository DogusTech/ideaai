package middleware

import (
	"log"
	"net/http"
	"strings"
)

func CORS(origin string) func(http.Handler) http.Handler {
	// Clean trailing slash from configured origin
	origin = strings.TrimSuffix(origin, "/")

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			reqOrigin := r.Header.Get("Origin")
			
			// Allow if exactly matches, OR if it's a vercel preview URL, OR if it's localhost
			isAllowed := false
			if reqOrigin == origin {
				isAllowed = true
			} else if strings.HasSuffix(reqOrigin, ".vercel.app") || strings.HasPrefix(reqOrigin, "http://localhost:") {
				isAllowed = true
			}

			if isAllowed {
				w.Header().Set("Access-Control-Allow-Origin", reqOrigin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
			} else if reqOrigin != "" {
				log.Printf("CORS BLOCKED: Request Origin '%s' is not allowed (Configured APP_ORIGIN: '%s')", reqOrigin, origin)
			}

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
