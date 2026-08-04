// Import Express to create API routes.
import express from "express";

// Import the Resident model so the routes can work with resident data.
import Resident from "../models/Resident.js";

// Create an Express router.
const router = express.Router();


// ========================================
// GET /api/residents
// READ all residents
// ========================================

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


// ========================================
// GET /api/residents/:id
// READ one resident
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    res.status(200).json(resident);
  } catch (error) {
    res.status(400).json({
      message: "Unable to retrieve resident",
      error: error.message,
    });
  }
});


// ========================================
// POST /api/residents
// CREATE a resident
// ========================================

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


// ========================================
// PUT /api/residents/:id
// UPDATE a resident
// ========================================

router.put("/:id", async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    res.status(200).json(resident);
  } catch (error) {
    res.status(400).json({
      message: "Unable to update resident",
      error: error.message,
    });
  }
});


// ========================================
// DELETE /api/residents/:id
// DELETE a resident
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    const resident = await Resident.findByIdAndDelete(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    res.status(200).json({
      message: "Resident deleted successfully",
      resident,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to delete resident",
      error: error.message,
    });
  }
});


// Export the router so index.js can import it.
export default router;