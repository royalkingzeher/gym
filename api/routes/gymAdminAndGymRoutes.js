const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGymAdminAndGym,
  getAllGymAdminAndGyms,
  getGymAdminsOfGym,
  getGymsOfGymAdmin,
} = require("../controllers/gymAdminAndGymController");

// Route to create a new GymAdminAndGym record
router.post("/", authMiddleware, createGymAdminAndGym);

// Route to get all GymAdminAndGym records
router.get("/", authMiddleware, getAllGymAdminAndGyms);

// Route to get gym admins of a gym by gymId
router.get("/gymAdmins/:gymId", authMiddleware, getGymAdminsOfGym);

// Route to get gyms of a gym admin by gymAdminId
router.get("/gyms/:gymAdminId", authMiddleware, getGymsOfGymAdmin);

module.exports = router;
