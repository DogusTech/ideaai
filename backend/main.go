package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "https://www.togetlink.com/ai", 301)
    })
    http.ListenAndServe("localhost:8080", nil)
}