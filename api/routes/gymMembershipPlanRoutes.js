const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGymMembershipPlan,
  getMembershipPlanById,
  getMembershipPlanByGymId,
  updateMembershipPlanById,
} = require("../controllers/gymMembershipPlanController");

router.post("/", authMiddleware, createGymMembershipPlan);
router.get("/:planId", authMiddleware, getMembershipPlanById);
router.get("/:gymId", authMiddleware, getMembershipPlanByGymId);
router.put("/update/:planId", authMiddleware, updateMembershipPlanById);

module.exports = router;
