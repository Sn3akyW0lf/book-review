const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Review = sequelize.define('Review', {
    review_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review_text: Sequelize.TEXT
});

module.exports = Review;