const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// CORS configuration for development
app.use(cors({
    origin: ["http://localhost:5173", "https://syncthreads-map-ux93.vercel.app"], // Allow all origins in development
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // Disable credentials for development
}));

app.use(cookieParser());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error(" MongoDB Connection Error:", error));

// Add Default User
const addDefaultUser = async () => {
  const User = require("./models/User");

  try {
    const existingUser = await User.findOne({ username: "Swati" });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Swati@2025", salt);
      
      const newUser = new User({
        username: "swati",
        password: hashedPassword,
      });

      await newUser.save();
      console.log(" Default user 'swati' added. and ");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error adding default user:", error);
  }
};

mongoose.connection.once("open", addDefaultUser);

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));


