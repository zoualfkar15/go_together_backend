const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Driver creates a ride
router.post("/create", authenticate, authorize(["driver"]), rideController.createRide);

// Get all rides (any user)
router.get("/", authenticate, rideController.getAllRides);

//  get my rides
router.get("/my-rides", authenticate, authorize(["driver", "passenger"]), rideController.getMyRides);

// Admin can delete any ride
//router.delete("/:id", authenticate, authorize(["admin", "driver"]), rideController.delete);

module.exports = router;
