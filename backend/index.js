// Import Express to create the backend server.
import express from "express";

// Import CORS so the React frontend can communicate with the backend.
import cors from "cors";

// Import dotenv to load environment variables from the .env file.
import dotenv from "dotenv";

// Import the MongoDB connection function.
import connectDB from "./config/db.js";

// Import resident API routes.
import residentRoutes from "./routes/residentRoutes.js";

// Import wellness check API routes.
import wellnessCheckRoutes from "./routes/wellnessCheckRoutes.js";

// Load environment variables from .env.
dotenv.config();

// Connect the application to MongoDB Atlas.
connectDB();

// Create the Express application.
const app = express();

// Use the environment PORT if available.
// Otherwise, use port 5000 during local development.
const PORT = process.env.PORT || 5000;

// Allow requests from the React frontend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Resident API routes.
// Example: GET /api/residents
// Example: POST /api/residents
app.use("/api/residents", residentRoutes);

// Wellness Check API routes.
// Example: GET /api/wellness-checks
// Example: POST /api/wellness-checks
app.use("/api/wellness-checks", wellnessCheckRoutes);

// Test route to confirm that the backend API is running.
app.get("/", (req, res) => {
  res.json({
    message: "Shelter Wellness Check Management System API is running",
  });
});

// Start the Express server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});