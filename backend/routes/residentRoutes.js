// Import Express to create API routes.
import express from "express";

// Import the Resident model so the routes can work with resident data.
import Resident from "../models/Resident.js";

// Create an Express router.
const router = express.Router();

// GET /api/residents
// Get all residents from the MongoDB database.
router.get("/", async (req, res) => {
  try {
    const residents = await Resident.find();

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve residents",
      error: error.message,
    });
  }
});

// POST /api/residents
// Create and save a new resident in MongoDB.
router.post("/", async (req, res) => {
  try {
    const resident = await Resident.create(req.body);

    res.status(201).json(resident);
  } catch (error) {
    res.status(400).json({
      message: "Unable to create resident",
      error: error.message,
    });
  }
});

// Export the router so it can be used in index.js.
export default router;