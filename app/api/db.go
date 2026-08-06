package main

import (
    "context"
    "firebase/auth"
    "firebase/firestore"
)

func main() {
    // Initialize Firebase
    auth, err := auth.Initialize()
    if err != nil {
        panic(err)
    }

    // Get a Firestore client
    client, err := firestore.NewClient(context.Background(), "<FIREBASE_PROJECT_ID>")
    if err != nil {
        panic(err)
    }

    // Use the client
    _, err = client.Doc("users/1234567890").Get(context.Background())
    if err != nil {
        panic(err)
    }
}