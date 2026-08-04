package main

import (
  "context"
  "fmt"
  "net/http"
)

func main() {
  http.HandleFunc("/api/hello", helloHandler)
  fmt.Println("Server is listening on port 3000")
  http.ListenAndServe("3000", nil)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
  w.Write([]byte("Hello from Go!"))
}