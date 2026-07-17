package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type SeedRequest struct {
	PlaceID    string   `json:"placeId"`
	Category   string   `json:"category"`
	City       string   `json:"city"`
	Country    string   `json:"country"`
	BroadAreas []string `json:"broadAreas"`
	Visibility string   `json:"visibility"`
}

func main() {
	// Simple script to invoke /api/places/sync against the local backend
	
	seeds := []SeedRequest{
		{PlaceID: "ChIJmXYXdGe2yhQR3vkR5tjvb5M", Category: "coworking", City: "Istanbul", Country: "TR", Visibility: "public"},
		{PlaceID: "ChIJTQetquG5yhQRERNsVspY4Fc", Category: "coworking", City: "Istanbul", Country: "TR", Visibility: "public"},
	}

	for _, s := range seeds {
		payload, _ := json.Marshal(s)
		req, _ := http.NewRequestWithContext(context.Background(), "POST", "http://localhost:8080/api/places/sync", bytes.NewReader(payload))
		req.Header.Set("Content-Type", "application/json")
		
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("Failed to seed %s: %v", s.PlaceID, err)
			continue
		}
		resp.Body.Close()
		fmt.Printf("Seed %s: status %d\n", s.PlaceID, resp.StatusCode)
	}
}
