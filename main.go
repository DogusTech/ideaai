package main

import (
    "context"
    "fmt"
    "net/http"
    "firebase.google.com/go/v4"
    "firebase.google.com/go/v4/auth"
)

func main() {
    // Initialize Firebase
    ctx := context.Background()
    _, err := auth.DefaultAuth(ctx)
    if err != nil {
        panic(err)
    }

    // Create a new HTTP handler
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        // Handle the request
        fmt.Fprint(w, "Hello, World!")
    })
    http.ListenAndServe("localhost:8080", nil)
}
