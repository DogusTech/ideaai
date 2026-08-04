package main

import (
    "context"
    "fmt"
    "net/http"
)

func AiHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello from AI handler!")
}

func main() {
    http.HandleFunc("/ai", AiHandler)
    http.ListenAndServe("localhost:8080", nil)
}
