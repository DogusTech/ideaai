package models

import (
	"time"
)

// GeoPoint maps to Firestore GeoPoint safely without pulling in firestore package directly here if possible,
// but for simplicity we can use a struct that maps to it, or just use latlng.LatLng.
// We will define a simple struct.
type GeoPoint struct {
	Lat float64 `firestore:"latitude" json:"lat"`
	Lng float64 `firestore:"longitude" json:"lng"`
}

type PlaceCache struct {
	PlaceID          string       `firestore:"placeId" json:"placeId"`
	ResourceName     string       `firestore:"resourceName" json:"resourceName"`
	DisplayName      string       `firestore:"displayName" json:"displayName"`
	FormattedAddress string       `firestore:"formattedAddress,omitempty" json:"formattedAddress,omitempty"`
	City             string       `firestore:"city,omitempty" json:"city,omitempty"`
	Country          string       `firestore:"country,omitempty" json:"country,omitempty"`
	GoogleMapsURI    string       `firestore:"googleMapsUri,omitempty" json:"googleMapsUri,omitempty"`
	Location         *GeoPoint    `firestore:"location,omitempty" json:"location,omitempty"`
	Rating           *float64     `firestore:"rating,omitempty" json:"rating,omitempty"`
	UserRatingCount  *int64       `firestore:"userRatingCount,omitempty" json:"userRatingCount,omitempty"`
	PrimaryType      string       `firestore:"primaryType,omitempty" json:"primaryType,omitempty"`
	Types            []string     `firestore:"types,omitempty" json:"types,omitempty"`
	Photos           []PlacePhoto `firestore:"photos,omitempty" json:"photos,omitempty"`
	LastFetchedAt    time.Time    `firestore:"lastFetchedAt" json:"lastFetchedAt"`
	ExpiresAt        time.Time    `firestore:"expiresAt" json:"expiresAt"`
}
