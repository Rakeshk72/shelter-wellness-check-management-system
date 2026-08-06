// Import Express to create API routes.
import express from "express";

// Import the WellnessCheck model.
import WellnessCheck from "../models/WellnessCheck.js";

// Create an Express router.
const router = express.Router();

// GET /api/wellness-checks
// Retrieve all wellness checks from MongoDB.
// Display the newest wellness checks first.
router.get("/", async (req, res) => {
  try {
    const checks = await WellnessCheck.find()
      .populate("resident")
      .sort({ checkDateTime: -1 });

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve wellness checks",
      error: error.message,
    });
  }
});

// GET /api/wellness-checks/:id
// Retrieve one wellness check by its MongoDB ID.
router.get("/:id", async (req, res) => {
  try {
    const wellnessCheck = await WellnessCheck.findById(
      req.params.id
    ).populate("resident");

    if (!wellnessCheck) {
      return res.status(404).json({
        message: "Wellness check not found",
      });
    }

    res.status(200).json(wellnessCheck);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve wellness check",
      error: error.message,
    });
  }
});

// POST /api/wellness-checks
// Create a new wellness check record.
router.post("/", async (req, res) => {
  try {
    const wellnessCheck = await WellnessCheck.create(req.body);

    // Populate resident information before returning
    // the newly created wellness check.
    await wellnessCheck.populate("resident");

    res.status(201).json(wellnessCheck);
  } catch (error) {
    res.status(400).json({
      message: "Unable to create wellness check",
      error: error.message,
    });
  }
});

// PUT /api/wellness-checks/:id
// Update an existing wellness check by its MongoDB ID.
router.put("/:id", async (req, res) => {
  try {
    const wellnessCheck = await WellnessCheck.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!wellnessCheck) {
      return res.status(404).json({
        message: "Wellness check not found",
      });
    }

    // Populate resident information so the updated
    // wellness check returns complete resident details.
    await wellnessCheck.populate("resident");

    res.status(200).json(wellnessCheck);
  } catch (error) {
    res.status(400).json({
      message: "Unable to update wellness check",
      error: error.message,
    });
  }
});

// DELETE /api/wellness-checks/:id
// Delete a wellness check by its MongoDB ID.
router.delete("/:id", async (req, res) => {
  try {
    const wellnessCheck = await WellnessCheck.findByIdAndDelete(
      req.params.id
    );

    if (!wellnessCheck) {
      return res.status(404).json({
        message: "Wellness check not found",
      });
    }

    res.status(200).json({
      message: "Wellness check deleted successfully",
      wellnessCheck,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete wellness check",
      error: error.message,
    });
  }
});

// Export the router so it can be used in index.js.
export default router;