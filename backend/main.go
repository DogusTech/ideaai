// Import necessary packages
import (
  "context"
  "fmt"
  "net/http"
)

// Define the main function
func main() {
  http.HandleFunc("/ai", getAIResponse)
  http.ListenAndServe("localhost:8080", nil)
}