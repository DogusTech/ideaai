// Import required libraries
import express from "express";
import { db } from "./firebase";

// Initialize Express app
const app = express();
app.use(express.json());

// Define API endpoint
app.get("/api/data", (req, res) => {
  db.ref("data").once("value").then((snapshot) => {
    const data = snapshot.val();
    res.json(data);
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});