import ("net/http"
"github.com/gin-gonic/gin"
"firebase-go/auth"
"firebase-go/firestore"
)

func main() {
	// Initialize Firebase
	firebaseConfig := "YOUR_Firebase_CONFIG" // Replace with your Firebase config
	client, err := auth.NewClient(context.Background(), firebaseConfig)
	if err != nil {
		log.Fatal(err)
	}
	// Use the client to interact with Firestore
	firestoreClient, err := firestore.NewClient(context.Background(), client)
	if err != nil {
		log.Fatal(err)
	}
	// Create a new Gin router
	router := gin.Default()
	// Define a route to fetch user data from Firestore
	router.GET("/ai", func(c *gin.Context) {
		// Get the user ID from the query parameter
		userId := c.Query("user_id")
		// Use the Firestore client to get the user document
	tdocRef := firestoreClient.Doc("/users/" + userId)
	tdocSnap, err := tdocRef.Get(context.Background())
	tif err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		// Return the user data as JSON
	tcdata := map[string]interface{}{}
	terr := tdocSnap.Data(&tcdata)
	tif terr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": terr.Error(),
			})
			return
		}
	tc.JSON(http.StatusOK, tcdata)
	})
	// Start the Gin server
	if err := router.Run("localhost:8080"); err != nil {
		log.Fatal(err)
	}
}
