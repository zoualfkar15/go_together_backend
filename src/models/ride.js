// models/ride.js
module.exports = (sequelize, DataTypes) => {
  const Ride = sequelize.define("Ride", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    driverId: { type: DataTypes.INTEGER, allowNull: false },
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    seatsAvailable: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("upcoming", "completed", "canceled"),
      defaultValue: "upcoming",
    },
  });

  Ride.associate = (models) => {
    Ride.belongsTo(models.User, { foreignKey: "driverId" });
    Ride.hasMany(models.Booking, { foreignKey: "rideId", onDelete: "CASCADE" });
  };

  return Ride;
};
