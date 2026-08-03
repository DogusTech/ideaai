package main

import (
  "context"
  "firebase/auth"
  "firebase/firestore"
)

func main() {
  // Initialize Firebase
  auth, err := auth.Initialize("<FIREBASE_API_KEY>")
  if err != nil {
    panic(err)
  }

  // Create a Firestore client
  firestore, err := firestore.NewClient(auth)
  if err != nil {
    panic(err)
  }

  // Use the Firestore client
  // ...}
