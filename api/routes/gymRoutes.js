const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGym,
  getAllGyms,
  getGymById,
  getGymByParameter,
  updateGymById,
} = require("../controllers/gymController");

// Routes with added validation
router.post("/", authMiddleware, createGym);
router.get("/", authMiddleware, getAllGyms);
router.get("/:id", authMiddleware, getGymById);
router.post("/search", authMiddleware, getGymByParameter);
router.put("/:id", authMiddleware, updateGymById);

module.exports = router;
