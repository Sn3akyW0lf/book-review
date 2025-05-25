const path = require('path');
const express = require('express');
const reviewController = require('../controllers/review');
const authorization = require('../middleware/auth');
const router = express.Router();

// Editing an Existing Review
router.put('/:reviewId', authorization.authenticate, reviewController.editReview);

// Deleting a Review
router.delete('/:reviewId', authorization.authenticate, reviewController.deleteReview);

module.exports = router;