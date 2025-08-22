const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Driver adds their car
router.post("/add", authenticate, authorize(["driver"]), carController.addCar);

// Driver updates their car
router.put("/:id", authenticate, authorize(["driver"]), carController.updateCar);

// Driver views their cars
router.get("/my-cars", authenticate, authorize(["driver"]), carController.getMyCars);

// Admin can delete any car
router.delete("/:id", authenticate, authorize(["admin"]), carController.deleteCar);

module.exports = router;
