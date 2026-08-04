package main

import (
  "context"
  "fmt"
  "log"
  "net/http"
)

func main() {
  http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "AI API")
  })
  log.Fatal(http.ListenAndServe("localhost:8080", nil))
}