package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env.local"); err != nil {
		log.Println("Warning: Could not load .env.local file")
	}

	projectID := os.Getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")
	if projectID == "" {
		log.Fatal("NEXT_PUBLIC_FIREBASE_PROJECT_ID not set")
	}

	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	// 1. Create a dummy test user so we have someone to chat with
	dummyUID := "test-user-seed"
	_, err = client.Collection("users").Doc(dummyUID).Set(ctx, map[string]interface{}{
		"name":      "Alice Engineer",
		"headline":  "Software Developer at Acme",
		"email":     "alice@example.com",
		"company":   "Acme Corp",
		"bio":       "Just seeding data.",
		"createdAt": time.Now(),
		"updatedAt": time.Now(),
	})
	if err != nil {
		log.Fatalf("Failed to seed dummy user: %v", err)
	}
	
	fmt.Println("Seeding complete! You can now use the frontend to start a chat with 'test-user-seed' or other users.")
}
