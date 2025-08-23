const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Admin dashboard stats
//router.get("/dashboard", authenticate, authorize(["admin"]), adminController.getDashboardStats);

// Manage all users
router.get("/users", authenticate, authorize(["admin"]), adminController.getAllUsers);
//outer.put("/users/:id/block", authenticate, authorize(["admin"]), adminController.blockUser);

module.exports = router;
