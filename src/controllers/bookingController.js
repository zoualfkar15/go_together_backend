const { Booking, Ride, User } = require("../models");

module.exports = {
    createBooking: async (req, res) => {
        try {
            const passengerId = req.user.id;
            const { rideId, seatsBooked } = req.body;

            const ride = await Ride.findByPk(rideId);
            if (!ride || ride.status !== "upcoming") {
                return res.status(404).json({ message: "Ride not available" });
            }

            if (ride.seatsAvailable < seatsBooked) {
                return res.status(400).json({ message: "Not enough seats" });
            }

            const booking = await Booking.create({ rideId, passengerId, seatsBooked });

            // update seats
            await ride.update({ seatsAvailable: ride.seatsAvailable - seatsBooked });

            res.status(201).json({ message: "Booking confirmed", booking });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getMyBookings: async (req, res) => {
        try {
            const passengerId = req.user.id;
            const bookings = await Booking.findAll({
                where: { passengerId },
                include: [{ model: Ride }]
            });

            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getPassengersForRide: async (req, res) => {
        try {
            const driverId = req.user.id;
            const { rideId } = req.params;

            const ride = await Ride.findByPk(rideId);
            if (!ride || ride.driverId !== driverId) {
                return res.status(404).json({ message: "Unauthorized or ride not found" });
            }

            const passengers = await Booking.findAll({
                where: { rideId },
                include: [{ model: User, attributes: ["id", "name", "phone"] }]
            });

            res.json(passengers);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    cancelBooking: async (req, res) => {
        try {
            const passengerId = req.user.id;
            const { id } = req.params;

            const booking = await Booking.findByPk(id);
            if (!booking || booking.passengerId !== passengerId) {
                return res.status(404).json({ message: "Booking not found or unauthorized" });
            }

            const ride = await Ride.findByPk(booking.rideId);

            // restore seats
            await ride.update({ seatsAvailable: ride.seatsAvailable + booking.seatsBooked });

            await booking.update({ status: "canceled" });
            res.json({ message: "Booking canceled successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
};
