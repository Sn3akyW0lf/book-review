const Sequelize = require('sequelize');
const User = require('../models/user');
const Book = require('../models/book');
const Review = require('../models/review');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller for Creating a new Book in Database
exports.postBook = async (req, res) => {
    try {
        const {
            title,
            author,
            publish_year
        } = req.body;

        req.body.user_id = req.user.user_id;

        if (!title || !author || !publish_year) {
            return res.status(400).json({
                message: 'Title, Author Name and Publish Year is Required'
            });
        }

        const book = await Book.create(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: 'Book Successfully Added',
            bookObj: book
        });
    } catch (err) {
        console.log('Error Occurred in postBook in controller/book.js', err);
        res.status(500).json(err);
    }
};

// Controller for retrieving all Books offset by Pagination
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        console.log('Search Query --', search);
        const searchCondition = search ? {
            [Sequelize.Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), {
                    [Sequelize.Op.like]: `%${search}%`
                  }),
                  Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('author')), {
                    [Sequelize.Op.like]: `%${search}%`
                  })
            ]
        } : {};

        const totalBooks = await Book.count({ where: searchCondition });

        const books = await Book.findAll({
            where: searchCondition,
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT AVG(rating)
                            FROM Reviews AS review
                            WHERE review.book_id = Book.book_id
                        )`),
                        'average_rating'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM Reviews AS review
                            WHERE review.book_id = Book.book_id
                        )`),
                        'review_count'
                    ]
                ]
            },
            include: [
                {
                    model: User,
                    attributes: ['username' ]
                }
            ],
            order: [ [ 'publish_year', 'ASC' ]],
            limit,
            offset
        });

        res.status(200).json({
            success: true,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books,
        });
    } catch (err) {
        console.log('Error Occurred in getBooks in controller/book.js', err);
        res.status(500).json(err);
    }
};

// Controller to get one Book Record using book_id
exports.getBook = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);

        const book = await Book.findOne({
            where: {
                book_id: bookId
            },
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                        SELECT AVG(rating)
                        FROM Reviews AS review
                        WHERE review.book_id = Book.book_id
                      )`),
                        'average_rating'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM Reviews AS review
                            WHERE review.book_id = Book.book_id
                        )`),
                        'review_count'
                    ]
                ]
            },
            include: [{
                model: Review,
                attributes: ['review_id', 'user_id', 'rating', 'review_text', 'createdAt']
            }]
        });

        if (!book) {
            return res.status(404).json({
                error: 'Book Not Found'
            });
        }

        return res.status(200).json(book);
    } catch (err) {
        console.log('Error Occurred in getBook in controller/book.js', err);
        res.status(500).json(err);
    }
};

// Controller to create a Review record for a particular Book
exports.postReview = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);
        const {
            rating,
            review_text
        } = req.body;

        req.body.user_id = req.user.user_id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                error: 'Invalid User or Rating (1-5 Expected)'
            });
        }

        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                error: 'Book Not Found'
            });
        }

        const existingReview = await Review.findOne({
            where: {
                book_id: bookId,
                user_id: req.user.user_id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                error: 'Sorry You Already has Reviewed this Book, Try Editing Existing One.'
            });
        }

        const newReview = await req.user.createReview({
            book_id: bookId,
            rating,
            review_text
        });

        return res.status(201).json({
            success: true,
            message: 'Review Submitted Successfully',
            review: newReview
        });

    } catch (err) {
        console.log('Error Occurred in postReview in controller/book.js', err);
        res.status(500).json(err);
    }
};