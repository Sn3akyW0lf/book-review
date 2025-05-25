const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Book = sequelize.define('Book', {
    book_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        // unique: true
    },
    author: {
        type: Sequelize.STRING(255),
        allowNull: false,
        // unique: true,
    },
    publish_year: {
        type: Sequelize.STRING(255),
        // allowNull: false
    }
});

module.exports = Book;