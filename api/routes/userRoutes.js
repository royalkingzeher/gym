const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/:userId", authMiddleware, userController.getUserById);
router.get("/", authMiddleware, userController.getAllUsers);
router.put("/:userId", authMiddleware, userController.updateUser);
router.delete("/:userId", authMiddleware, userController.deleteUser);

module.exports = router;