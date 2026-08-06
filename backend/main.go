package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Ai API Route")
    })
    http.ListenAndServe("localhost:8080", nil)
}