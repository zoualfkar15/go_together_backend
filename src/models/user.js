// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    countrCode: { type: DataTypes.STRING, allowNull: false, unique: false },

    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("passenger", "driver", "admin"),
      allowNull: false,
      defaultValue: "passenger",
    },
    status: {
      type: DataTypes.ENUM("active", "blocked", "pending"),
      defaultValue: "pending",
    },
    profilePhoto: { type: DataTypes.STRING },
    verifiedDriver: { type: DataTypes.BOOLEAN, defaultValue: false }, // driver verification
    otpCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Car, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasMany(models.Ride, { foreignKey: "driverId", onDelete: "CASCADE" });
    User.hasMany(models.Booking, { foreignKey: "passengerId", onDelete: "CASCADE" });
  };

  return User;
};
