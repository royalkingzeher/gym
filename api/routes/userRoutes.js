const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserById } = require("../controllers/userController");

// Route to get a user by ID
router.get("/:userId", authMiddleware, getUserById);

module.exports = router;

