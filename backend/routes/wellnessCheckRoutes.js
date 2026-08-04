// Import Express to create API routes.
import express from "express";

// Import the WellnessCheck model.
import WellnessCheck from "../models/WellnessCheck.js";

// Create an Express router.
const router = express.Router();

// GET /api/wellness-checks
// Retrieve all wellness checks from MongoDB.
router.get("/", async (req, res) => {
  try {
    const checks = await WellnessCheck.find().populate("resident");

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve wellness checks",
      error: error.message,
    });
  }
});

// POST /api/wellness-checks
// Create a new wellness check record.
router.post("/", async (req, res) => {
  try {
    const wellnessCheck = await WellnessCheck.create(req.body);

    res.status(201).json(wellnessCheck);
  } catch (error) {
    res.status(400).json({
      message: "Unable to create wellness check",
      error: error.message,
    });
  }
});

// Export the router so it can be used in index.js.
export default router;