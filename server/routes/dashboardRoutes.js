const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // If using JWT for authentication

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

router.get('/dashboard', authMiddleware, (req, res) => {
    try {
        res.json({
            message: 'Login successful',
            username: req.user?.username || "Guest", // Prevent errors if user is missing
            dashboardData: {
                about: "This is the dashboard section where you can access various features.",
                imageUrl: "https://via.placeholder.com/150"
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
