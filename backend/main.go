package main

import (
  "context"
  "fmt"
  "log"
  "net/http"
  "github.com/go-playground/validator/v10"
  "google.golang.org/appengine"
  "google.golang.org/appengine/context"
  "google.golang.org/appengine/log"
  "google.golang.org/appengine/taskqueue"
  "google.golang.org/appengine/user"
  "google.golang.org/appengine/v2/internal/expvar"
  "google.golang.org/appengine/v2/internal/reporting"
)

func main() {
  // Create a new HTTP server
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    // Serve the index.html file
    http.ServeFile(w, r, "index.html")
  })

  // Start the server
  log.Info("Server started on port 8080")
  log.Fatal(http.ListenAndServe("localhost:8080", nil))
}