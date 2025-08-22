const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('go_together_db', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;