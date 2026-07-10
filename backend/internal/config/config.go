package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                     string
	AppEnv                   string
	AppOrigin                string
	FirebaseProjectID        string
	GooglePlacesAPIKey       string
	PlacesCacheTTLHours      int
	PhotoURITTLMinutes       int
	SessionCookieName        string
	SessionCookieSecure      bool
}

func Load() *Config {
	_ = godotenv.Load() // ignore error, file might not exist in production

	cfg := &Config{
		Port:                getEnv("PORT", "8080"),
		AppEnv:              getEnv("APP_ENV", "development"),
		AppOrigin:           getEnv("APP_ORIGIN", "http://localhost:3000"),
		FirebaseProjectID:   getEnv("FIREBASE_PROJECT_ID", "demo-togetlink"),
		GooglePlacesAPIKey:  getEnv("GOOGLE_PLACES_API_KEY", ""),
		PlacesCacheTTLHours: getEnvAsInt("PLACES_CACHE_TTL_HOURS", 12),
		PhotoURITTLMinutes:  getEnvAsInt("PHOTO_URI_TTL_MINUTES", 30),
		SessionCookieName:   getEnv("SESSION_COOKIE_NAME", "togetlink_session"),
		SessionCookieSecure: getEnvAsBool("SESSION_COOKIE_SECURE", false),
	}

	if cfg.GooglePlacesAPIKey == "" {
		log.Println("WARNING: GOOGLE_PLACES_API_KEY is not set. Places API calls will fail.")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return fallback
}

func getEnvAsBool(key string, fallback bool) bool {
	if value, exists := os.LookupEnv(key); exists {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return fallback
}
