const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");


// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Public routes
// ...other routes...

// Public routes
router.post("/signup", upload.single("profileImage"), userController.signup);
router.post("/login", userController.login);
router.post("/send-code", userController.sendCode);
router.post("/verify", userController.verify);
router.post("/reset-password", userController.resetPassword);

// Protected routes (any logged-in user)
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.post("/change-password", authenticate, userController.changePassword);

// Admin-only routes
router.put("/verify-driver/:id", authenticate, authorize(["admin"]), userController.verifyDriver);
router.put("/block-user/:id", authenticate, authorize(["admin"]), userController.blockUser);

module.exports = router;