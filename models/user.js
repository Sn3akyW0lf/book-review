const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
});

module.exports = User;