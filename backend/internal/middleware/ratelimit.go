package middleware

import (
	"golang.org/x/time/rate"
	"net/http"
	"sync"
)

type client struct {
	limiter *rate.Limiter
}

var (
	mu      sync.Mutex
	clients = make(map[string]*client)
)

func getLimiter(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	c, exists := clients[ip]
	if !exists {
		// allow 5 requests per second with a burst of 10
		limiter := rate.NewLimiter(5, 10)
		clients[ip] = &client{limiter: limiter}
		return limiter
	}

	return c.limiter
}

func RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		// Basic IP extraction
		if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
			ip = forwarded
		}

		limiter := getLimiter(ip)
		if !limiter.Allow() {
			http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
