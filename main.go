package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "AI Landing Page")
    })
    http.ListenAndServe("localhost:8080", nil)
}