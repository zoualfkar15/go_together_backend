const { Ride } = require('../models/ride');

const createRide = async (rideData) => {
    try {
        const ride = await Ride.create(rideData);
        return ride;
    } catch (error) {
        throw new Error('Error creating ride: ' + error.message);
    }
};

const getRides = async () => {
    try {
        const rides = await Ride.findAll();
        return rides;
    } catch (error) {
        throw new Error('Error fetching rides: ' + error.message);
    }
};

const updateRide = async (rideId, updatedData) => {
    try {
        const [updated] = await Ride.update(updatedData, {
            where: { id: rideId }
        });
        return updated ? await Ride.findByPk(rideId) : null;
    } catch (error) {
        throw new Error('Error updating ride: ' + error.message);
    }
};

module.exports = {
    createRide,
    getRides,
    updateRide
};