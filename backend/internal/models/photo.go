package models

type PlacePhoto struct {
	Name               string              `firestore:"name" json:"name"`
	WidthPx            int                 `firestore:"widthPx,omitempty" json:"widthPx,omitempty"`
	HeightPx           int                 `firestore:"heightPx,omitempty" json:"heightPx,omitempty"`
	AuthorAttributions []AuthorAttribution `firestore:"authorAttributions,omitempty" json:"authorAttributions,omitempty"`
	GoogleMapsURI      string              `firestore:"googleMapsUri,omitempty" json:"googleMapsUri,omitempty"`
	FlagContentURI     string              `firestore:"flagContentUri,omitempty" json:"flagContentUri,omitempty"`
	
	// Dynamically added by backend for frontend consumption, never stored permanently
	PhotoURI  string `firestore:"-" json:"photoUri,omitempty"`
	Source    string `firestore:"-" json:"source,omitempty"`
	ExpiresAt string `firestore:"-" json:"expiresAt,omitempty"`
}

type AuthorAttribution struct {
	DisplayName string `firestore:"displayName,omitempty" json:"displayName,omitempty"`
	URI         string `firestore:"uri,omitempty" json:"uri,omitempty"`
	PhotoURI    string `firestore:"photoUri,omitempty" json:"photoUri,omitempty"`
}
