package main

import (
  "context"
  "fmt"
  "log"
  "net/http"
)

func main() {
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, World!")
  })
  log.Fatal(http.ListenAndServe("localhost:8080", nil))
}