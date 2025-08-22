const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Driver creates a ride
router.post("/create", authenticate, authorize(["driver"]), rideController.createRide);

// Get all rides (any user)
router.get("/", authenticate, rideController.getAllRides);

// Driver's upcoming rides
router.get("/my-rides", authenticate, authorize(["driver"]), rideController.getMyRides);

// Admin can delete any ride
router.delete("/:id", authenticate, authorize(["admin"]), rideController.deleteRide);

module.exports = router;
