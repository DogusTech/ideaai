package httpx

import (
	"encoding/json"
	"log"
	"net/http"
)

func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		_ = json.NewEncoder(w).Encode(data)
	}
}

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func Error(w http.ResponseWriter, status int, message string) {
	log.Printf("HTTP Error %d: %s", status, message)
	JSON(w, status, ErrorResponse{
		Error: ErrorDetail{
			Code:    status,
			Message: message,
		},
	})
}
