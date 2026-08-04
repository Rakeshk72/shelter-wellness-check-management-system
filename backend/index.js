// Import Express to create the backend server.
import express from "express";

// Import CORS so the React frontend can communicate with the backend.
import cors from "cors";

// Import dotenv to load environment variables from the .env file.
import dotenv from "dotenv";

// Import our MongoDB connection function.
import connectDB from "./config/db.js";

// Load environment variables from the .env file.
// This must happen before we try to use MONGODB_URI.
dotenv.config();

// Connect the application to MongoDB Atlas.
connectDB();

// Create the Express application.
const app = express();

// Use the PORT stored in .env if available.
// Otherwise, use port 5000 during local development.
const PORT = process.env.PORT || 5000;

// Middleware that allows the React frontend
// to communicate with the Express backend.
app.use(cors());

// Middleware that allows Express to read JSON
// data sent in the body of incoming requests.
app.use(express.json());

// Test route.
// This confirms that our backend API is running correctly.
app.get("/", (req, res) => {
  res.json({
    message: "Shelter Wellness Check Management System API is running",
  });
});

// Start the Express server and listen for requests.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});