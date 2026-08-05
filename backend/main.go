package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        http.Error(w, "AI endpoint not implemented yet.", http.StatusNotFound)
    })
    fmt.Println("Server listening on port 8080...")
    http.ListenAndServe("localhost:8080", nil)
}