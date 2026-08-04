package main
import (
  "context"
  "fmt"
  "net/http"
)
func main() {
  http.HandleFunc("/ai", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello from Golang API!")
  })
  http.ListenAndServe("localhost:3000", nil)
}