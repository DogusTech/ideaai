package main

import (
    "context"
    "database/sql"
    "fmt"
)

func ConnectDB() (*sql.DB, error) {
    // Implement database connection logic here
    return nil, nil
}

func main() {
    db, err := ConnectDB()
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("Connected to database")
}