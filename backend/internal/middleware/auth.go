package middleware

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
)

type UserContextKey string
const UIDKey UserContextKey = "uid"
const AdminKey UserContextKey = "admin"

func UserIDFromContext(ctx context.Context) string {
	uid, _ := ctx.Value(UIDKey).(string)
	return uid
}

func RequireAuth(authClient *auth.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == "PUT" && r.URL.Path == "/api/users/me" {
				log.Printf("PUT /api/users/me headers: %v", r.Header)
			}
			
			cookie, err := r.Cookie("session")
			if err != nil {
				http.Error(w, "Unauthorized (missing cookie): "+err.Error(), http.StatusUnauthorized)
				return
			}

			token, err := authClient.VerifySessionCookieAndCheckRevoked(r.Context(), cookie.Value)
			if err != nil {
				http.Error(w, "Unauthorized (invalid token): "+err.Error(), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UIDKey, token.UID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RequireAdmin(authClient *auth.Client, fsClient *firestore.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			uid, ok := r.Context().Value(UIDKey).(string)
			if !ok {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			user, err := authClient.GetUser(r.Context(), uid)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// 1. Check Custom Claim
			if claims, ok := user.CustomClaims["admin"]; ok {
				if isAdmin, isBool := claims.(bool); isBool && isAdmin {
					ctx := context.WithValue(r.Context(), AdminKey, true)
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}
			}

			// 2. Fallback to Firestore check
			doc, err := fsClient.Collection("users").Doc(uid).Get(r.Context())
			if err == nil {
				if roles, ok := doc.Data()["roles"].(map[string]interface{}); ok {
					if isAdmin, ok := roles["admin"].(bool); ok && isAdmin {
						ctx := context.WithValue(r.Context(), AdminKey, true)
						next.ServeHTTP(w, r.WithContext(ctx))
						return
					}
				}
			}

			http.Error(w, "Forbidden - Admin access required", http.StatusForbidden)
		})
	}
}
