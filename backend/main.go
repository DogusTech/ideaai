package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/ai", 302)
    })
    http.ListenAndServe("localhost:8080", nil)
}