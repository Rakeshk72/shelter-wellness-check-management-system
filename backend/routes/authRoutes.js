// Import Express to create authentication routes.
import express from "express";

// Import bcryptjs to compare hashed passwords.
import bcrypt from "bcryptjs";

// Import jsonwebtoken to create login tokens.
import jwt from "jsonwebtoken";

// Create an Express router.
const router = express.Router();

// Demo staff account.
// The password is hashed when the server starts.
const demoUsername = "staff";
const demoPassword = "Wellness123!";

const hashedPassword = await bcrypt.hash(
  demoPassword,
  10
);

// POST /api/auth/login
// Verify staff credentials and return a JWT token.
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check that both fields were provided.
    if (!username || !password) {
      return res.status(400).json({
        message:
          "Username and password are required.",
      });
    }

    // Verify the username.
    if (username !== demoUsername) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // Compare the entered password with the
    // hashed password.
    const passwordMatches =
      await bcrypt.compare(
        password,
        hashedPassword
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // Create a signed authentication token.
    const token = jwt.sign(
      {
        username,
        role: "staff",
      },
      process.env.JWT_SECRET ||
        "development-secret-key",
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        username,
        role: "staff",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to login.",
      error: error.message,
    });
  }
});

export default router;