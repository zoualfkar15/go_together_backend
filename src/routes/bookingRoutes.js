const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Passenger books a ride
//router.post("/book", authenticate, authorize(["passenger"]), bookingController.bookRide);

// Passenger views bookings
router.get("/my-bookings", authenticate, authorize(["passenger"]), bookingController.getMyBookings);
router.put("/updateStatus", authenticate, authorize(["driver",]), bookingController.updateBookingStatus);

// Driver views bookings for their rides
//outer.get("/ride-bookings/:rideId", authenticate, authorize(["driver"]), bookingController.getRideBookings);

// Admin can cancel any booking
router.delete("/:id", authenticate, authorize(["admin"]), bookingController.cancelBooking);

module.exports = router;
