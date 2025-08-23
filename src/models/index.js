const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import each model explicitly
const User = require('./user')(sequelize, DataTypes);
const Car = require('./car')(sequelize, DataTypes);
const Ride = require('./ride')(sequelize, DataTypes);
const Booking = require('./booking')(sequelize, DataTypes);
const Admin = require('./admin')(sequelize, DataTypes);

// Add models to the export object
const models = {
    User,
    Car,
    Ride,
    Booking,
    Admin,
    sequelize,
};

// Setup associations
if (User.associate) User.associate(models);
if (Car.associate) Car.associate(models);
if (Ride.associate) Ride.associate(models);
if (Booking.associate) Booking.associate(models);
if (Admin.associate) Admin.associate(models);

module.exports = models;