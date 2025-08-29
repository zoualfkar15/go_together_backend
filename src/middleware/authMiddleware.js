const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// Authenticate middleware
const authenticate = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        if (user.status == 'blocked') return res.status(401).json({ message: "User blocked" });
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Authorize middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};


module.exports = { authenticate, authorize };
//example usage in routes
//router.put("/verify-driver/:id", authenticate, authorize(["admin"]), userController.verifyDriver);
