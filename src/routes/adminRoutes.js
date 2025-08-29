const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Admin dashboard stats
router.get("/dashboard", authenticate, authorize(["admin"]), adminController.dashboard);

// Manage all users
router.get("/users", authenticate, authorize(["admin"]), adminController.getAllUsers);
router.get("/rides", authenticate, authorize(["admin"]), adminController.getAllRides);
router.post("/blockUser", authenticate, authorize(["admin"]), adminController.blockUser);
module.exports = router;
