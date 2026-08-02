import ("firebase/functions")
"firebase-admin"

func main() {
  // Initialize Firebase
  firebase := admin.NewApp(context.Background(), "<path-to-firestore-credentials>")

  // Create a new Firestore client
  client, err := firebase.Firestore(context.Background())
  if err != nil {
    log.Fatal(err)
  }

  // Create a new collection
  col, err := client.Collection("data").Doc("document").Get(context.Background())
  if err != nil {
    log.Fatal(err)
  }

  // Get the document data
  data, err := col.Data(context.Background())
  if err != nil {
    log.Fatal(err)
  }

  // Print the document data
  fmt.Println(data)
}
