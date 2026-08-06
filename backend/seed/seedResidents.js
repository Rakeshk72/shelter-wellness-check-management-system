// Load environment variables from the backend .env file.
import dotenv from "dotenv";

// Import Mongoose so we can connect to MongoDB.
import mongoose from "mongoose";

// Import the Resident model.
import Resident from "../models/Resident.js";

// Load environment variables.
dotenv.config({
  path: "./backend/.env",
});

// Create fictional residents for capstone testing.
// No real shelter client information is used.
const demoResidents = [
  {
    unitNumber: "101",
    clientName: "Demo Resident 01",
    caresNumber: "DEMO-1001",
    familySize: 4,
    adultsInFamily: 2,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "102",
    clientName: "Demo Resident 02",
    caresNumber: "DEMO-1002",
    familySize: 3,
    adultsInFamily: 1,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "103",
    clientName: "Demo Resident 03",
    caresNumber: "DEMO-1003",
    familySize: 5,
    adultsInFamily: 2,
    childrenInFamily: 3,
    isActive: true,
  },
  {
    unitNumber: "104",
    clientName: "Demo Resident 04",
    caresNumber: "DEMO-1004",
    familySize: 2,
    adultsInFamily: 1,
    childrenInFamily: 1,
    isActive: true,
  },
  {
    unitNumber: "105",
    clientName: "Demo Resident 05",
    caresNumber: "DEMO-1005",
    familySize: 5,
    adultsInFamily: 2,
    childrenInFamily: 3,
    isActive: true,
  },
  {
    unitNumber: "106",
    clientName: "Demo Resident 06",
    caresNumber: "DEMO-1006",
    familySize: 3,
    adultsInFamily: 2,
    childrenInFamily: 1,
    isActive: true,
  },
  {
    unitNumber: "107",
    clientName: "Demo Resident 07",
    caresNumber: "DEMO-1007",
    familySize: 4,
    adultsInFamily: 1,
    childrenInFamily: 3,
    isActive: true,
  },
  {
    unitNumber: "108",
    clientName: "Demo Resident 08",
    caresNumber: "DEMO-1008",
    familySize: 2,
    adultsInFamily: 2,
    childrenInFamily: 0,
    isActive: true,
  },
  {
    unitNumber: "109",
    clientName: "Demo Resident 09",
    caresNumber: "DEMO-1009",
    familySize: 6,
    adultsInFamily: 2,
    childrenInFamily: 4,
    isActive: true,
  },
  {
    unitNumber: "110",
    clientName: "Demo Resident 10",
    caresNumber: "DEMO-1010",
    familySize: 3,
    adultsInFamily: 1,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "111",
    clientName: "Demo Resident 11",
    caresNumber: "DEMO-1011",
    familySize: 4,
    adultsInFamily: 2,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "112",
    clientName: "Demo Resident 12",
    caresNumber: "DEMO-1012",
    familySize: 5,
    adultsInFamily: 1,
    childrenInFamily: 4,
    isActive: true,
  },
  {
    unitNumber: "113",
    clientName: "Demo Resident 13",
    caresNumber: "DEMO-1013",
    familySize: 2,
    adultsInFamily: 1,
    childrenInFamily: 1,
    isActive: true,
  },
  {
    unitNumber: "114",
    clientName: "Demo Resident 14",
    caresNumber: "DEMO-1014",
    familySize: 3,
    adultsInFamily: 2,
    childrenInFamily: 1,
    isActive: true,
  },
  {
    unitNumber: "115",
    clientName: "Demo Resident 15",
    caresNumber: "DEMO-1015",
    familySize: 4,
    adultsInFamily: 1,
    childrenInFamily: 3,
    isActive: true,
  },
  {
    unitNumber: "116",
    clientName: "Demo Resident 16",
    caresNumber: "DEMO-1016",
    familySize: 5,
    adultsInFamily: 2,
    childrenInFamily: 3,
    isActive: true,
  },
  {
    unitNumber: "117",
    clientName: "Demo Resident 17",
    caresNumber: "DEMO-1017",
    familySize: 3,
    adultsInFamily: 1,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "118",
    clientName: "Demo Resident 18",
    caresNumber: "DEMO-1018",
    familySize: 4,
    adultsInFamily: 2,
    childrenInFamily: 2,
    isActive: true,
  },
  {
    unitNumber: "119",
    clientName: "Demo Resident 19",
    caresNumber: "DEMO-1019",
    familySize: 2,
    adultsInFamily: 2,
    childrenInFamily: 0,
    isActive: true,
  },
  {
    unitNumber: "120",
    clientName: "Demo Resident 20",
    caresNumber: "DEMO-1020",
    familySize: 6,
    adultsInFamily: 2,
    childrenInFamily: 4,
    isActive: true,
  },
];

// Connect to MongoDB and insert the fictional residents.
async function seedResidents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for resident seeding.");

    // Remove only previously-created demo residents
    // so running the seed more than once does not create duplicates.
    await Resident.deleteMany({
      caresNumber: {
        $regex: "^DEMO-",
      },
    });

    await Resident.insertMany(demoResidents);

    console.log(
      `${demoResidents.length} demo residents added successfully.`
    );
  } catch (error) {
    console.error(
      "Unable to seed demo residents:",
      error.message
    );
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
}

// Run the seed function.
seedResidents();