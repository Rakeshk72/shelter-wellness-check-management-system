// Import Mongoose to connect our application to MongoDB.
import mongoose from "mongoose";

// Create a function that connects the backend to MongoDB.
const connectDB = async () => {
  try {
    // Connect using the MongoDB URI stored in the .env file.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    // Display the connection error if MongoDB cannot connect.
    console.error("MongoDB connection failed:", error.message);

    // Stop the server if the database connection fails.
    process.exit(1);
  }
};

export default connectDB;