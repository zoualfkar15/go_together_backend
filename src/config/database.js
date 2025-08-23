const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");


dotenv.config();
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
});

sequelize.sync({ force: false, alter: true })

module.exports = sequelize;