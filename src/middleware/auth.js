const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = {
    authenticate: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "No token provided" });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({ message: "Invalid token" });
            }

            req.user = user; // store full user (not just decoded)
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    },

    authorize: (roles = []) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden - Not enough permissions" });
            }
            next();
        };
    }
};
//example usage in routes
//router.put("/verify-driver/:id", authenticate, authorize(["admin"]), userController.verifyDriver);
