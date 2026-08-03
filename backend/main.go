package main

import (
  "context"
  "fmt"
  "net/http"
)

func main() {
  http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Ai API Route"))
  })
  fmt.Println("Server is running on port 8080")
  http.ListenAndServe("localhost:8080", nil)
}
