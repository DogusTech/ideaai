package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
        // TO DO: Implement AI Router
    })
    fmt.Println("Server started on port 3000")
    http.ListenAndServe("3000", nil)
}