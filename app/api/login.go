package main

import (\n    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Login Page")
    })
    http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Register Page")
    })
    http.ListenAndServe("localhost:8080", nil)
}