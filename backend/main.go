package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Welcome to TogetLink!")
    })
    http.ListenAndServe("localhost:8080", nil)
}