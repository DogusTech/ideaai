package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/api/ai", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "AI API")
    })
    http.ListenAndServe("localhost:8080", nil)
}