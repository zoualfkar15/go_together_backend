const { User, Ride, Booking } = require("../models");
const { blockUser } = require("./userController");

module.exports = {
    dashboard: async (req, res) => {
        try {

            const totalDrivers = await User.count({ where: { role: "driver" } });
            const totalPassenger = await User.count({ where: { role: "passenger" } });

            const totalRides = await Ride.count();
            const activeRides = await Ride.count({ where: { status: "upcoming" } });
            const totalBookings = await Booking.count();

            res.json({ totalDrivers, totalPassenger, totalRides, activeRides, totalBookings });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getAllRides: async (req, res) => {
        try {
            const rides = await Ride.findAll();
            res.json(rides);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    deleteRide: async (req, res) => {
        try {
            const { id } = req.params;
            const ride = await Ride.findByPk(id);

            if (!ride) return res.status(404).json({ message: "Ride not found" });

            await ride.destroy();
            res.json({ message: "Ride deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },


    // ----------------------------
    // Change Password (logged-in user)
    // ----------------------------
    blockUser: async (req, res) => {
        try {
            const { userId, status } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            await user.update({ status });

            res.json({ message: "User updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

};
