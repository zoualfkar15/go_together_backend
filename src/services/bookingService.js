const { Booking } = require('../models/booking');
const { User } = require('../models/user');
const { Ride } = require('../models/ride');

const createBooking = async (userId, rideId) => {
    const booking = await Booking.create({ userId, rideId, status: 'confirmed' });
    return booking;
};

const getBookingsByUserId = async (userId) => {
    const bookings = await Booking.findAll({ where: { userId } });
    return bookings;
};

const updateBookingStatus = async (bookingId, status) => {
    const booking = await Booking.findByPk(bookingId);
    if (booking) {
        booking.status = status;
        await booking.save();
        return booking;
    }
    throw new Error('Booking not found');
};

module.exports = {
    createBooking,
    getBookingsByUserId,
    updateBookingStatus,
};