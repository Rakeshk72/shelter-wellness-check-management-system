// Import Mongoose to create the Wellness Check schema and model.
import mongoose from "mongoose";

// Create the schema for each wellness check performed in the shelter.
const wellnessCheckSchema = new mongoose.Schema(
  {
    // Connect this wellness check to a resident.
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    // Date and time when the wellness check was completed.
    // The backend automatically records this if no date is supplied.
    checkDateTime: {
      type: Date,
      default: Date.now,
    },

    // Identify which scheduled wellness-check round
    // this record belongs to.
    checkRound: {
      type: String,
      enum: [
        "Overnight Check",
        "8AM-4PM Round 1",
        "8AM-4PM Round 2",
        "8AM-4PM Round 3",
        "4PM-12AM Round 1",
        "4PM-12AM Round 2",
        "4PM-12AM Round 3",
        "Not Recorded",
      ],
      default: "Not Recorded",
    },

    // Record whether the resident/family was present
    // during the wellness check.
    status: {
      type: String,
      enum: ["Present", "Absent", "Partial"],
      required: true,
    },

    // Record whether the resident/family was present
    // during the NSR check.
    nsrPresence: {
      type: String,
      enum: [
        "Present",
        "Absent",
        "Partial",
        "Not Recorded",
      ],
      default: "Not Recorded",
    },

    // Number of adults present during the wellness check.
    adultsPresent: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of children present during the wellness check.
    childrenPresent: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Additional observations or notes from staff.
    comments: {
      type: String,
      trim: true,
      default: "",
    },

    // Name of the staff member who completed the wellness check.
    staffName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  }
);

// Create the WellnessCheck model.
const WellnessCheck = mongoose.model(
  "WellnessCheck",
  wellnessCheckSchema
);

// Export the model so it can be used in routes/controllers.
export default WellnessCheck;