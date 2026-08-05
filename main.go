package main

import (
    "context"
    "firebase/auth"
    "firebase/firestore"
    "net/http"
)

func main() {
    // Initialize Firebase
    // ...
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        // ...
    })
    fmt.Println("Server started on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}