package models

import (
	"time"
)

type Hub struct {
	ID               string       `firestore:"id" json:"id"`
	PlaceID          string       `firestore:"placeId" json:"placeId"`
	ResourceName     string       `firestore:"resourceName" json:"resourceName"`
	Slug             string       `firestore:"slug" json:"slug"`
	Name             string       `firestore:"name" json:"name"`
	NormalizedName   string       `firestore:"normalizedName" json:"normalizedName"`
	Category         string       `firestore:"category" json:"category"`
	City             string       `firestore:"city" json:"city"`
	Country          string       `firestore:"country" json:"country"`
	FormattedAddress string       `firestore:"formattedAddress,omitempty" json:"formattedAddress,omitempty"`
	GoogleMapsURI    string       `firestore:"googleMapsUri,omitempty" json:"googleMapsUri,omitempty"`
	Location         *GeoPoint    `firestore:"location,omitempty" json:"location,omitempty"`
	Rating           *float64     `firestore:"rating,omitempty" json:"rating,omitempty"`
	UserRatingCount  *int64       `firestore:"userRatingCount,omitempty" json:"userRatingCount,omitempty"`
	Photos           []PlacePhoto `firestore:"photos,omitempty" json:"photos,omitempty"`
	HeroPhoto        *PlacePhoto  `firestore:"heroPhoto,omitempty" json:"heroPhoto,omitempty"`
	CardPhoto        *PlacePhoto  `firestore:"cardPhoto,omitempty" json:"cardPhoto,omitempty"`
	BroadAreas       []string     `firestore:"broadAreas" json:"broadAreas"`
	Tags             []string     `firestore:"tags" json:"tags"`
	Source           string       `firestore:"source" json:"source"`
	Visibility       string       `firestore:"visibility" json:"visibility"`
	LastPlacesSyncAt *time.Time   `firestore:"lastPlacesSyncAt,omitempty" json:"lastPlacesSyncAt,omitempty"`
	CreatedAt        time.Time    `firestore:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time    `firestore:"updatedAt" json:"updatedAt"`
	
	// Dynamic wrapper for frontend
	Photo *PlacePhoto `firestore:"-" json:"photo,omitempty"`
}
