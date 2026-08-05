// TOGETLINK BACKEND MAIN FILE
package main

import (
    "context"
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/api/dashboard", dashboard)
    http.ListenAndServe("localhost:8080", nil)
}

func dashboard(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Dashboard")
}