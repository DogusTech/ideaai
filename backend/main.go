package main
import (
  "context"
  "fmt"
  "net/http"
)
func main() {
  http.HandleFunc("/api/login", loginHandler)
  http.HandleFunc("/api/register", registerHandler)
  http.HandleFunc("/api/dashboard", dashboardHandler)
  http.ListenAndServe("localhost:8080", nil)
}
func loginHandler(w http.ResponseWriter, r *http.Request) {
  // TO DO: Implement Login API
  fmt.Fprint(w, "Login API not implemented")
}
func registerHandler(w http.ResponseWriter, r *http.Request) {
  // TO DO: Implement Register API
  fmt.Fprint(w, "Register API not implemented")
}
func dashboardHandler(w http.ResponseWriter, r *http.Request) {
  // TO DO: Implement Dashboard API
  fmt.Fprint(w, "Dashboard API not implemented")
}