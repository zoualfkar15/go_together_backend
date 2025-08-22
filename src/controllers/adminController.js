const { User, Ride, Booking } = require("../models");

module.exports = {
    dashboard: async (req, res) => {
        try {
            const totalUsers = await User.count();
            const totalRides = await Ride.count();
            const activeRides = await Ride.count({ where: { status: "upcoming" } });
            const totalBookings = await Booking.count();

            res.json({ totalUsers, totalRides, activeRides, totalBookings });
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
    }
};
