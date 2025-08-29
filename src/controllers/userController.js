const argon2 = require("argon2"); // Replace bcrypt import with argon2
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
            const profilePhoto = req.file ? req.file.filename : null;

            if (role === 'admin') return res.status(400).json({ message: "You can't register with this role" });
            // Check if user already exists
            const existingUser = await User.findOne({ where: { phone, countryCode } });
            if (existingUser) {
                return res.status(400).json({ message: "Phone already registered" });
            }

            // Hash password
            const hashedPassword = await argon2.hash(password); // Use argon2 to hash password


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
                expiresAt,
                profilePhoto // Save filename in DB
            });



            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },




    // ----------------------------
    // Send Code
    // ----------------------------
    sendCode: async (req, res) => {
        try {
            const { countryCode, phone } = req.body;

            // Set OTP expiration time (5 minutes from now)
            let expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 5);

            // Generate OTP code (for demo, static; in production, random)
            let otpCode = '123456';

            // Find user by phone and countryCode
            const user = await User.findOne({ where: { phone, countryCode } });

            if (user) {
                // Update OTP code and expiration
                await user.update({ otpCode, expiresAt });
                res.json({ message: "OTP sent successfully", user });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },


    // ----------------------------
    // Verify OTP
    // ----------------------------
    verify: async (req, res) => {
        try {
            const { phone, countryCode, otpCode } = req.body;
            const user = await User.findOne({
                where: { phone, countryCode },
                include: [{ model: Car }],
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.otpCode !== otpCode) {
                return res.status(400).json({ message: "Invalid OTP code" });
            }

            if (user.expiresAt < new Date()) {
                return res.status(400).json({ message: "OTP code expired" });
            }

            // Optionally clear OTP after verification
            await user.update({ otpCode: null, expiresAt: null, status: "active" });

            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: "7d" }
            );


            res.json({ message: "OTP verified successfully", token, user });
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
            const { phone, countryCode, password } = req.body;

            const user = await User.findOne({
                where: { phone, countryCode },
                include: [{ model: Car }],
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.status === 'blocked') {
                return res.status(401).json({ message: "User Blocked" });

            }

            const validPassword = await argon2.verify(user.password, password); // Use argon2 for password check
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

            // Build dynamic update object
            const updates = {};
            if (name !== null && name !== undefined) updates.name = name;
            if (phone !== null && phone !== undefined) updates.phone = phone;
            if (profilePhoto !== null && profilePhoto !== undefined) updates.profilePhoto = profilePhoto;

            // Only update provided fields
            await user.update(updates);

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



    // ----------------------------
    // Change Password (logged-in user)
    // ----------------------------
    changePassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const validPassword = await argon2.verify(user.password, oldPassword); // Use argon2 to verify old password
            if (!validPassword) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }

            const hashedPassword = await argon2.hash(newPassword); // Use argon2 to hash new password
            await user.update({ password: hashedPassword });

            res.json({ message: "Password changed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },


    // ----------------------------
    // Reset Password (using OTP)
    // ----------------------------
    resetPassword: async (req, res) => {
        try {
            const { phone, countryCode, otpCode, newPassword } = req.body;
            const user = await User.findOne({ where: { phone, countryCode } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.otpCode !== otpCode) {
                return res.status(400).json({ message: "Invalid OTP code" });
            }

            if (user.expiresAt < new Date()) {
                return res.status(400).json({ message: "OTP code expired" });
            }

            const hashedPassword = await argon2.hash(newPassword); // Use argon2 to hash new password
            await user.update({ password: hashedPassword, otpCode: null, expiresAt: null });

            res.json({ message: "Password reset successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },


};
