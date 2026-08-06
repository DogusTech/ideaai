package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/login", loginHandler)
    fmt.Println("Server is running on port 8080")
    http.ListenAndServe("localhost:8080", nil)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    // TO DO: Implement login logic
    fmt.Fprint(w, "Login successful")
}
