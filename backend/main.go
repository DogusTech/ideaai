package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/login", login)
    http.HandleFunc("/register", register)

    fmt.Println("Server listening on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}

func login(w http.ResponseWriter, r *http.Request) {
    // Implement login logic here
}

func register(w http.ResponseWriter, r *http.Request) {
    // Implement register logic here
}
