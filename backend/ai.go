package main

import (
    "context"
    "firebase/auth"
    "firebase/firestore"
    "fmt"
    "net/http"
)

func main() {
    // Initialize Firebase
    auth, err := auth.Initialize()
    if err != nil {
        panic(err)
    }

    // Create a Firestore client
    firestore, err := firestore.NewClient()
    if err != nil {
        panic(err)
    }

    // Set up routes
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        // Authenticate the user
        user, err := auth.GetUser(r.Context())
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Get the user's data from Firestore
        userData, err := firestore.GetDocument(user.UID)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Render the AiLandingPage component
        http.Redirect(w, r, "https://www.togetlink.com/ai", 301)
    })
    http.ListenAndServe("localhost:8080", nil)
}