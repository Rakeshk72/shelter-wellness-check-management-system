// Import Mongoose so we can create a schema and model.
import mongoose from "mongoose";

// Create the schema that defines how resident data
// will be stored in MongoDB.
const residentSchema = new mongoose.Schema(
  {
    // Shelter unit or room number assigned to the resident.
    unitNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Name of the head of household or primary client.
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    // CARES identification number for the client.
    caresNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Total number of people in the family.
    familySize: {
      type: Number,
      required: true,
      min: 1,
    },

    // Indicates whether the resident/family is currently active
    // in the shelter.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  }
);

// Create the Resident model from the schema.
const Resident = mongoose.model("Resident", residentSchema);

// Export the model so routes/controllers can use it.
export default Resident;