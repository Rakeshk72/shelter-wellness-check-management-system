// Import Express to create the backend server.
import express from "express";

// Import CORS so the React frontend can communicate with the backend.
import cors from "cors";

// Import dotenv to load environment variables from a .env file.
import dotenv from "dotenv";

// Load environment variables.
dotenv.config();

// Create the Express application.
const app = express();

// Use the environment PORT if available.
// Otherwise, use port 5000 during local development.
const PORT = process.env.PORT || 5000;

// Allow requests from the frontend application.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Test route to confirm that the backend API is working.
app.get("/", (req, res) => {
  res.json({
    message: "Shelter Wellness Check Management System API is running",
  });
});

// Start the backend server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});