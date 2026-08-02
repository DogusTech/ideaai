package main

type About struct {}

func main() {
	// Create a new About instance
	about := &About{}

	// Do something with the About instance
	// For example, you can return a JSON response
	returnJson := `{
		"message": "Hello, World!",
		"about": "Google Hakkında"
	}
	`

	// Return the JSON response
	returnJson
}
