const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const membershipPlanPriceController = require("../controllers/membershipplanpricecontroller"); 

router.get("/", authMiddleware, membershipPlanPriceController.getAllMembershipPlanPrices);
router.get("/:id", authMiddleware, membershipPlanPriceController.getMembershipPlanPriceById);
router.post("/", authMiddleware, membershipPlanPriceController.createMembershipPlanPrice);
router.put("/:id", authMiddleware, membershipPlanPriceController.updateMembershipPlanPrice);
router.delete("/:id", authMiddleware, membershipPlanPriceController.deleteMembershipPlanPrice);

module.exports = router;
