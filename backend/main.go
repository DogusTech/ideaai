import "github.com/go-playground/validator/v10"
import "github.com/gorilla/mux"
import "github.com/sirupsen/logrus"

func main() {
    // Initialize logger
    log := logrus.New()
    log.SetLevel(logrus.DebugLevel)

    // Initialize router
    router := mux.NewRouter()

    // Initialize database
    db := firestore.NewClient()

    // Start server
    log.Info("Server started on port 8080")
    if err := http.ListenAndServe("8080", router); err != nil {
        log.Fatal(err)
    }
}