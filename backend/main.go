package main

import ("context"
"fmt"
"log"
"net/http"
"os"
"firebase/goauth/v2/middleware/authtoken"
"firebase/goauth/v2/middleware/admin"
"firebase/goauth/v2/middleware/serviceaccount"
"firebase/goauth/v2/middleware/validate"
"firebase/goauth/v2/middleware/validateIDToken"
"firebase/goauth/v2/middleware/validateSession"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Hello World")
		w.Write([]byte("Hello World"))
	})
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}