// Importing Essential Packages
const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 4000;

// Setting up Database Configuration
const sequelize = require('./util/database');

app.use(express.json());


// Model Definitions
const User = require('./models/user');
const Book = require('./models/book');
const Review = require('./models/review');

// Routes Imports
const UserRoutes = require('./routes/user');
const BookRoutes = require('./routes/book');
const ReviewRoutes = require('./routes/review');


// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes for User, Book and Reviews
app.use('/api/v1/auth', UserRoutes);
app.use('/api/v1/book', BookRoutes);
app.use('/api/v1/review', ReviewRoutes);

// Defining Database Relations
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Book, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Book.belongsTo(User, { foreignKey: 'user_id' });

Book.hasMany(Review, { foreignKey: 'book_id', onDelete: 'CASCADE' });
Review.belongsTo(Book, { foreignKey: 'book_id' });


// Initializing the Project
sequelize
    .sync()
    // .sync({ force: true })
    .then(() => {
        app.listen(PORT, () => {
        console.log(`App has Started on Port - ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err, 'Error in app.js sequelize');
    })
