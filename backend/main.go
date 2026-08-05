package main

import (
  "context"
  "fmt"
  "net/http"
  "firebase.google.com/go/v4"
  "firebase.google.com/go/v4/auth"
)

func main() {
  // Use the Firebase SDK to initialize Firebase
  ctx := context.Background()
  _, err := auth.DefaultClient(ctx, "<API_KEY>")
  if err != nil {
    panic(err)
  }
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Firebase Authentication initialized!")
  })
  http.ListenAndServe("localhost:8080", nil)
}
