package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/login", loginHandler)
    http.HandleFunc("/register", registerHandler)

    fmt.Println("Server listening on port 8080...")
    http.ListenAndServe("localhost:8080", nil)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    // TO DO: Implement login logic
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
    // TO DO: Implement register logic
}
