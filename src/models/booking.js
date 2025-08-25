// models/booking.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rideId: { type: DataTypes.INTEGER, allowNull: false },
    passengerId: { type: DataTypes.INTEGER, allowNull: false },
    seatsBooked: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "canceled"),
      defaultValue: "pending",
    },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Ride, { foreignKey: "rideId" });
    Booking.belongsTo(models.User, { foreignKey: "passengerId" });
  };

  return Booking;
};
