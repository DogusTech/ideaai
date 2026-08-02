package main

import (
    "context"
    "database/sql"
    "fmt"
    "net/http"
)

func SignupHandler(ctx context.Context) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Implement signup logic here
        fmt.Fprint(w, "Signup successful")
    }
}

func main() {
    http.HandleFunc("/signup", SignupHandler(context.Background()))
    fmt.Println("Server started on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}