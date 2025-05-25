const path = require('path');
const express = require('express');
const bookController = require('../controllers/book');
const authorization = require('../middleware/auth');
const router = express.Router();

// Adding a New Book to the Database
router.post('/add-book', authorization.authenticate, bookController.postBook);

// Retrieving Books from the Database in Pagination
router.get('/get-books', authorization.authenticate, bookController.getBooks);

// Retrieving a Particular Book from the Database using book_id
router.get('/get-book/:bookId', authorization.authenticate, bookController.getBook);

// Post a Review about the Book
router.post('/get-book/:bookId/reviews', authorization.authenticate, bookController.postReview);

module.exports = router;