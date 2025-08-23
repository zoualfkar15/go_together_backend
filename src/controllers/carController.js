const { Car } = require("../models");

module.exports = {
    addCar: async (req, res) => {
        try {
            const { model, color, plateNumber } = req.body;
            const userId = req.user.id;

            const car = await Car.create({ userId, model, color, plateNumber });
            res.status(201).json({ message: "Car added successfully", car });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getMyCar: async (req, res) => {
        try {
            const userId = req.user.id;
            const car = await Car.findOne({ where: { userId } });

            if (!car) return res.status(404).json({ message: "Car not found" });

            res.json(car);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    },

    updateCar: async (req, res) => {
        try {
            const userId = req.user.id;
            const { model, color, plateNumber } = req.body;

            const car = await Car.findOne({ where: { userId } });
            if (!car) return res.status(404).json({ message: "Car not found" });

            await car.update({ model, color, plateNumber });
            res.json({ message: "Car updated successfully", car });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
};
