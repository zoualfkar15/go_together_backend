const { Ride, User } = require("../models");

module.exports = {
    createRide: async (req, res) => {
        try {
            const driverId = req.user.id;
            const { from, to, dateTime, price, seatsAvailable } = req.body;

            const ride = await Ride.create({ driverId, from, to, dateTime, price, seatsAvailable });
            res.status(201).json({ message: "Ride created successfully", ride });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getAllRides: async (req, res) => {
        try {
            const { from, to, date } = req.query;

            const rides = await Ride.findAll({
                where: { status: "upcoming" },
                include: [{ model: User, attributes: ["id", "name", "phone", "verified"] }]
            });

            res.json(rides);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getRideById: async (req, res) => {
        try {
            const ride = await Ride.findByPk(req.params.id, {
                include: [{ model: User, attributes: ["id", "name", "phone", "verified"] }]
            });

            if (!ride) return res.status(404).json({ message: "Ride not found" });

            res.json(ride);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    updateRide: async (req, res) => {
        try {
            const driverId = req.user.id;
            const { id } = req.params;

            const ride = await Ride.findByPk(id);
            if (!ride || ride.driverId !== driverId) {
                return res.status(404).json({ message: "Ride not found or unauthorized" });
            }

            await ride.update(req.body);
            res.json({ message: "Ride updated successfully", ride });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    cancelRide: async (req, res) => {
        try {
            const driverId = req.user.id;
            const { id } = req.params;

            const ride = await Ride.findByPk(id);
            if (!ride || ride.driverId !== driverId) {
                return res.status(404).json({ message: "Ride not found or unauthorized" });
            }

            await ride.update({ status: "canceled" });
            res.json({ message: "Ride canceled successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
};
