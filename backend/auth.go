package main

import (
    "context"
    "fmt"
    "net/http"
    "firebase.google.com/go/v4"
    "firebase.google.com/go/v4/auth"
)

func main() {
    // Initialize Firebase
    ctx := context.Background()
    app, err := firebase.NewApp(ctx, nil)
    if err != nil {
        panic(err)
    }

    // Get the Firebase Auth instance
    authClient, err := auth.NewClient(ctx, app, "<API_KEY>")
    if err != nil {
        panic(err)
    }

    // Create a new user
    user, err := authClient.CreateUser(ctx, &auth.User{Email: "user@example.com"})
    if err != nil {
        panic(err)
    }

    fmt.Println(user)
}
