const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGymMembershipPlan,
  getMembershipPlanById,
  getMembershipPlansByGymId,
  updateMembershipPlanById,
} = require("../controllers/gymMembershipPlanController");

router.post("/", authMiddleware, createGymMembershipPlan);
router.get("/:planId", authMiddleware, getMembershipPlanById);
router.get("/allByGym/:gymId", authMiddleware, getMembershipPlansByGymId);
router.put("/update/:planId", authMiddleware, updateMembershipPlanById);

module.exports = router;
