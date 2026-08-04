package main

import (
  "context"
  "fmt"
  "net/http"
)

func main() {
  http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello from TogetLink AI backend!")
  })
  http.ListenAndServe("localhost:8080", nil)
}
