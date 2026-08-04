import (
    "context"
    "firebase.google.com/go/v4"
    "firebase.google.com/go/v4/auth"
)

func main() {
    // Initialize Firebase
    ctx := context.Background()
    app, err := firebase.NewApp(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    // ... rest of the code ...
}
