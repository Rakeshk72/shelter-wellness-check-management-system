// Import Express to create the backend server.
import express from "express";

// Import CORS so the React frontend can communicate with the backend.
import cors from "cors";

// Import dotenv to load environment variables from the .env file.
import dotenv from "dotenv";

// Import our MongoDB connection function.
import connectDB from "./config/db.js";

// Import resident routes for resident API operations.
import residentRoutes from "./routes/residentRoutes.js";

// Load environment variables from the .env file.
dotenv.config();

// Connect the application to MongoDB Atlas.
connectDB();

// Create the Express application.
const app = express();

// Use the PORT stored in .env if available.
// Otherwise, use port 5000 during local development.
const PORT = process.env.PORT || 5000;

// Allow requests from the React frontend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Use resident routes for all requests starting with /api/residents.
app.use("/api/residents", residentRoutes);

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