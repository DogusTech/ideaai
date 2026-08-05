package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe("localhost:8080", nil)
}

func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello from Go!")
}