package places

import (
	"strings"
	"time"

	"togetlink-api/internal/models"
)

func MapToPlaceCache(raw map[string]interface{}, expiresAt time.Time) *models.PlaceCache {
	pc := &models.PlaceCache{
		PlaceID:          getString(raw, "id"),
		ResourceName:     getString(raw, "name"),
		DisplayName:      getDisplayName(raw),
		FormattedAddress: getString(raw, "formattedAddress"),
		GoogleMapsURI:    getString(raw, "googleMapsUri"),
		PrimaryType:      getString(raw, "primaryType"),
		Types:            getStringSlice(raw, "types"),
		LastFetchedAt:    time.Now().UTC(),
		ExpiresAt:        expiresAt,
	}

	if loc := getMap(raw, "location"); loc != nil {
		pc.Location = &models.GeoPoint{
			Lat: getFloat(loc, "latitude"),
			Lng: getFloat(loc, "longitude"),
		}
	}

	if rating, ok := raw["rating"].(float64); ok {
		pc.Rating = &rating
	}
	
	if count, ok := raw["userRatingCount"].(float64); ok {
		c := int64(count)
		pc.UserRatingCount = &c
	}

	if photosRaw, ok := raw["photos"].([]interface{}); ok {
		var photos []models.PlacePhoto
		for _, p := range photosRaw {
			if pm, ok := p.(map[string]interface{}); ok {
				photos = append(photos, mapPlacePhoto(pm))
			}
		}
		pc.Photos = photos
	}

	// Basic city/country extraction from address (heuristic or if available via address components later)
	extractCityCountry(pc.FormattedAddress, pc)

	return pc
}

func mapPlacePhoto(raw map[string]interface{}) models.PlacePhoto {
	pp := models.PlacePhoto{
		Name:           getString(raw, "name"),
		WidthPx:        int(getFloat(raw, "widthPx")),
		HeightPx:       int(getFloat(raw, "heightPx")),
		GoogleMapsURI:  getString(raw, "googleMapsUri"),
		FlagContentURI: getString(raw, "flagContentUri"),
	}

	if attrRaw, ok := raw["authorAttributions"].([]interface{}); ok {
		for _, a := range attrRaw {
			if am, ok := a.(map[string]interface{}); ok {
				pp.AuthorAttributions = append(pp.AuthorAttributions, models.AuthorAttribution{
					DisplayName: getString(am, "displayName"),
					URI:         getString(am, "uri"),
					PhotoURI:    getString(am, "photoUri"),
				})
			}
		}
	}
	return pp
}

func getDisplayName(raw map[string]interface{}) string {
	if dn, ok := raw["displayName"].(map[string]interface{}); ok {
		return getString(dn, "text")
	}
	return ""
}

func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}

func getFloat(m map[string]interface{}, key string) float64 {
	if v, ok := m[key].(float64); ok {
		return v
	}
	return 0
}

func getMap(m map[string]interface{}, key string) map[string]interface{} {
	if v, ok := m[key].(map[string]interface{}); ok {
		return v
	}
	return nil
}

func getStringSlice(m map[string]interface{}, key string) []string {
	if v, ok := m[key].([]interface{}); ok {
		var res []string
		for _, s := range v {
			if str, ok := s.(string); ok {
				res = append(res, str)
			}
		}
		return res
	}
	return nil
}

// Very naive fallback for city/country, real implementation would parse address_components.
func extractCityCountry(address string, pc *models.PlaceCache) {
	if strings.Contains(address, "Istanbul") || strings.Contains(address, "İstanbul") {
		pc.City = "Istanbul"
		pc.Country = "TR"
	} else if strings.Contains(address, "San Francisco") {
		pc.City = "San Francisco"
		pc.Country = "US"
	} else if strings.Contains(address, "New York") {
		pc.City = "New York"
		pc.Country = "US"
	} else if strings.Contains(address, "Austin") {
		pc.City = "Austin"
		pc.Country = "US"
	} else if strings.Contains(address, "Izmir") || strings.Contains(address, "İzmir") {
		pc.City = "Izmir"
		pc.Country = "TR"
	} else if strings.Contains(address, "Ankara") {
		pc.City = "Ankara"
		pc.Country = "TR"
	}
}
