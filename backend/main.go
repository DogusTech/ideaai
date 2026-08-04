package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/api/ai", func(w http.ResponseWriter, r *http.Request) {
        // TO DO: Implement AI API endpoint
    })
    fmt.Println("Server listening on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}