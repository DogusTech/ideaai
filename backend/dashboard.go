package main

import (
    "context"
    "fmt"
    "net/http"
)

func DashboardHandler(ctx context.Context) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Dashboard Page")
    }
}

func main() {
    http.HandleFunc("/dashboard", DashboardHandler(context.Background()))
    fmt.Println("Server started on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}