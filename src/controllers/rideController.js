const { Ride, User, Booking } = require("../models");
const { Op } = require("sequelize");

module.exports = {
    createRide: async (req, res) => {
        try {
            const driverId = req.user.id;
            const { from, to, datetime, price, seats } = req.body;
            console.log(datetime);

            const ride = await Ride.create({ driverId, from, to, dateTime: datetime, price, seatsAvailable: seats, seats, status: "upcoming" });
            res.status(201).json({ message: "Ride created successfully", ride });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },



    getAllRides: async (req, res) => {
        try {
            const { from, to, date } = req.query;

            const whereClause = { status: "upcoming" };

            if (from) {
                whereClause.from = { [Op.like]: `%${from}%` };
            }
            if (to) {
                whereClause.to = { [Op.like]: `%${to}%` };
            }
            if (date) {
                // Frontend should send UTC ISO string: "2025-08-26T00:00:00Z"
                const startOfDay = new Date(date);
                startOfDay.setUTCHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setUTCHours(23, 59, 59, 999);

                whereClause.dateTime = {
                    [Op.between]: [startOfDay, endOfDay],
                };
            }

            const rides = await Ride.findAll({
                where: whereClause,
                include: [
                    { model: User, }, // driver info
                    { model: Booking, include: [{ model: User }] } // passengers
                ]
            });

            res.json(rides);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },


    // getRideById: async (req, res) => {
    //     try {
    //         const ride = await Ride.findByPk(req.params.id, {
    //             include: [{ model: User, attributes: ["id", "name", "phone", "verified"] }]
    //         });

    //         if (!ride) return res.status(404).json({ message: "Ride not found" });

    //         res.json(ride);
    //     } catch (error) {
    //         res.status(500).json({ message: "Server error" });
    //     }
    // },

    // updateRide: async (req, res) => {
    //     try {
    //         const driverId = req.user.id;
    //         const { id } = req.params;

    //         const ride = await Ride.findByPk(id);
    //         if (!ride || ride.driverId !== driverId) {
    //             return res.status(404).json({ message: "Ride not found or unauthorized" });
    //         }

    //         await ride.update(req.body);
    //         res.json({ message: "Ride updated successfully", ride });
    //     } catch (error) {
    //         res.status(500).json({ message: "Server error" });
    //     }
    // },


    updateRideStatus: async (req, res) => {
        try {
            const { rideId } = req.body;          // ride ID
            const { status } = req.body;        // 'completed' or 'canceled'
            const userId = req.user.id;         // logged-in user
            const userRole = req.user.role;     // optional, driver/admin

            // Validate status
            if (!["completed", "canceled"].includes(status)) {
                return res.status(400).json({ message: "Invalid status. Must be 'completed' or 'canceled'." });
            }

            const ride = await Ride.findByPk(rideId);
            if (!ride) {
                return res.status(404).json({ message: "Ride not found" });
            }

            // Optional: Only driver or admin can update
            if (userRole === "driver" && ride.driverId !== userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            await ride.update({ status });

            res.json({ message: `Ride status updated to ${status}`, ride });
        } catch (error) {
            console.error(error);
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
    },

    getMyRides: async (req, res) => {


        // try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let rides;
        if (userRole === "driver") {
            // Driver: rides they created
            rides = await Ride.findAll({
                where: { driverId: userId },
                include: [
                    { model: User, }, // driver info
                    { model: Booking, include: [{ model: User }] } // passengers
                ]
            });
        } else if (userRole === "passenger") {



            // rides for passenger
            rides = await Ride.findAll({
                include: [
                    {
                        model: User, // driver info
                    },
                    {
                        model: Booking,
                        required: true,
                        where: { passengerId: userId, status: "confirmed" },
                        include: [{ model: User, }] // passenger info
                    }
                ]
            });


        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(rides);
        // } catch (error) {
        //     res.status(500).json({ message: "Server error" });
        // }
    }
};
