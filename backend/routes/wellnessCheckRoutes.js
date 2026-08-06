// Import Express to create API routes.
import express from "express";

// Import the WellnessCheck model.
import WellnessCheck from "../models/WellnessCheck.js";

// Create an Express router.
const router = express.Router();

// GET /api/wellness-checks
// Retrieve wellness checks from MongoDB.
// If a resident ID is provided, return checks for that resident only.
// Display the newest wellness checks first.
router.get("/", async (req, res) => {
  try {
    // Create an empty filter for the MongoDB query.
    const filter = {};

    // If a resident ID is provided in the query string,
    // retrieve wellness checks for that resident only.
    if (req.query.resident) {
      filter.resident = req.query.resident;
    }

    const checks = await WellnessCheck.find(filter)
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
    const {
      resident,
      checkRound,
      checkDateTime,
    } = req.body;

    // Prevent duplicate scheduled wellness checks.
    //
    // A duplicate means:
    // same resident
    // + same calendar date
    // + same scheduled check round.
    //
    // "Not Recorded" is excluded because the individual
    // wellness-check form may be used for unscheduled checks.
    if (
      resident &&
      checkRound &&
      checkRound !== "Not Recorded"
    ) {
      // Use the submitted check date when available.
      // Otherwise use the current date.
      const submittedDate = checkDateTime
        ? new Date(checkDateTime)
        : new Date();

      // Create the beginning of the selected day.
      const startOfDay = new Date(submittedDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Create the beginning of the following day.
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      // Look for an existing wellness check for the same
      // resident, date, and scheduled round.
      const existingCheck = await WellnessCheck.findOne({
        resident,
        checkRound,
        checkDateTime: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      // Stop the request if this round was already recorded.
      if (existingCheck) {
        // Populate resident information so we can identify
        // the exact unit in the duplicate warning.
        await existingCheck.populate("resident");

        const unitNumber =
          existingCheck.resident?.unitNumber ||
          "Unknown";

        // Format the date into an easy-to-read value.
        const formattedDate =
          submittedDate.toLocaleDateString();

        return res.status(409).json({
          message:
            `Unit ${unitNumber} already has a wellness check for ${checkRound} on ${formattedDate}.`,
        });
      }
    }

    // Create the wellness check after duplicate validation passes.
    const wellnessCheck = await WellnessCheck.create(
      req.body
    );

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
    const wellnessCheck =
      await WellnessCheck.findByIdAndUpdate(
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
    const wellnessCheck =
      await WellnessCheck.findByIdAndDelete(
        req.params.id
      );

    if (!wellnessCheck) {
      return res.status(404).json({
        message: "Wellness check not found",
      });
    }

    res.status(200).json({
      message:
        "Wellness check deleted successfully",
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