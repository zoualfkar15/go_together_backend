const { Booking, Ride, User } = require("../models");

module.exports = {
    bookRide: async (req, res) => {
        try {
            const passengerId = req.user.id;
            const { rideId, seatsBooked } = req.body;

            const ride = await Ride.findByPk(rideId);
            if (!ride || ride.status !== "upcoming") {
                return res.status(404).json({ message: "Ride not available" });
            }

            // 2. Check if passenger already booked this ride
            const existingBooking = await Booking.findOne({
                where: { rideId, passengerId }
            });

            if (existingBooking) {
                return res.status(400).json({ message: "You already booked this ride" });
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


    updateBookingStatus: async (req, res) => {
        try {
            const driverId = req.user.id; // driver who owns the ride
            const { bookingId, status } = req.body; // status = "accepted" | "rejected"

            if (!["confirmed", "canceled"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            // find booking
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            // find ride
            const ride = await Ride.findByPk(booking.rideId);
            if (!ride || ride.driverId !== driverId) {
                return res.status(403).json({ message: "Not authorized to update this booking" });
            }

            // check if already processed
            if (booking.status !== "pending") {
                return res.status(400).json({ message: "Booking already processed" });
            }



            // if accepted → reduce seats
            if (status === "confirmed") {
                if (ride.seatsAvailable < booking.seatsBooked) {
                    return res.status(400).json({ message: "Not enough seats anymore" });
                }

                // update booking status
                await booking.update({ status });

                await ride.update({
                    seatsAvailable: ride.seatsAvailable - booking.seatsBooked
                });
            } else if (status === "canceled") {

                // update booking status
                await booking.update({ status });
            }

            return res.status(200).json({ message: `Booking ${status}`, booking });
        } catch (error) {
            console.error(error);
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
