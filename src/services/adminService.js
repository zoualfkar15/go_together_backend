const { User, Ride } = require('../models');

const adminService = {
    manageUsers: async () => {
        return await User.findAll();
    },

    manageRides: async () => {
        return await Ride.findAll();
    },

    deleteUser: async (userId) => {
        return await User.destroy({ where: { id: userId } });
    },

    deleteRide: async (rideId) => {
        return await Ride.destroy({ where: { id: rideId } });
    }
};

module.exports = adminService;