func main() {
	// Initialize Firestore and Authentication
	ctx := context.Background()
	_, err := auth.DefaultApp(ctx, "<API_KEY>"),
	fs, err := firestore.NewClient(ctx, "<API_KEY>"
	if err != nil {
		log.Fatal(err)
	}
	// Initialize router
	router := mux.NewRouter()
	// Define routes
	router.HandleFunc("/ai", aiHandler).Methods("GET")
	// Start server
	log.Fatal(http.ListenAndServe("localhost:8080", router))
}