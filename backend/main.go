package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/api/ai", aiHandler)
    fmt.Println("Server is running on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}

func aiHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "AI Landing Page API Handler")
}