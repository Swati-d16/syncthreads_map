const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  console.log("Login Request Received");
  console.log("Request Body:", req.body);
  const { username, password } = req.body;
  
  try {
    console.log("Searching for user:", username);
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found, comparing passwords");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Password does not match for user:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Password matched, generating token");
    // Generate Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated successfully");

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
