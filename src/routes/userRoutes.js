const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes (any logged-in user)
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);

// Admin-only routes
router.put("/verify-driver/:id", authenticate, authorize(["admin"]), userController.verifyDriver);
router.put("/block-user/:id", authenticate, authorize(["admin"]), userController.blockUser);

module.exports = router;
