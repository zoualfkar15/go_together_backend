const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Car } = require("../models");

// JWT Secret (better put in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = {
    // ----------------------------
    // Signup
    // ----------------------------
    signup: async (req, res) => {
        try {
            const { name, countryCode, phone, password, role } = req.body;

            if (role === 'admin') return res.status(400).json({ message: "You can't register with this role" });
            // Check if user already exists
            const existingUser = await User.findOne({ where: { phone, countryCode } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);


            // Set OTP expiration time (5 minutes from now)
            let expiresAt = new Date();
            expiresAt = expiresAt.setMinutes(expiresAt.getMinutes() + 5);

            // Generate and encrypt OTP
            let otpCode = '123456';


            // Create user
            const newUser = await User.create({
                name,
                phone,
                countryCode,
                password: hashedPassword,
                role,
                otpCode,
                expiresAt
            });



            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ----------------------------
    // Login
    // ----------------------------
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({ message: "Login successful", token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ----------------------------
    // Get Profile
    // ----------------------------
    getProfile: async (req, res) => {
        try {
            const userId = req.user.id; // from auth middleware

            const user = await User.findByPk(userId, {
                include: [{ model: Car }],
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ----------------------------
    // Update Profile
    // ----------------------------
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, phone, profilePhoto } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            await user.update({ name, phone, profilePhoto });

            res.json({ message: "Profile updated successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ----------------------------
    // Admin: Verify Driver
    // ----------------------------
    verifyDriver: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user || user.role !== "driver") {
                return res.status(404).json({ message: "Driver not found" });
            }

            await user.update({ verified: true });

            res.json({ message: "Driver verified successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ----------------------------
    // Admin: Block / Unblock User
    // ----------------------------
    blockUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { block } = req.body; // true = block, false = unblock

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (block) {
                await user.update({ status: "blocked" });
                res.json({ message: "User blocked successfully" });
            } else {
                await user.update({ status: "active" });
                res.json({ message: "User unblocked successfully" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
};
