const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Driver adds their car
router.post("/createOrUpdate", authenticate, authorize(["driver"]), carController.addOrUpdateCar);




module.exports = router;
