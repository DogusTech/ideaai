package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc(
        "/",
        func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "Welcome to TogetLink!")
        }
    )

    fmt.Println("Server is listening on port 8080")
    http.ListenAndServe(
        ":8080",
        nil
    )
}
