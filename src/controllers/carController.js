const { Car } = require("../models");

module.exports = {
    addOrUpdateCar: async (req, res) => {
        try {
            const { model, color, plateNumber } = req.body;
            const userId = req.user.id;

            // Check if user already has a car
            let car = await Car.findOne({ where: { userId } });

            if (car) {
                // Update existing car
                await car.update({ model, color, plateNumber });
                return res.json({ message: "Car updated successfully", car });
            } else {
                // Create new car
                car = await Car.create({ userId, model, color, plateNumber });
                return res.status(201).json({ message: "Car updated successfully", car });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },




};
