const Review = require('../models/review');


// Controller to Update existing Review Record
exports.editReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const { rating, review_text } = req.body;
        const userId = req.user.user_id;

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({error: 'Rating Must be between 1 and 5'});
        }

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review Not Found' });
        }

        if (review.user_id !==userId) {
            return res.status(403).json({ error:'User is Not Authorized to Edit this Review' });
        }

        const updates = {};
        if (rating !== undefined) updates.rating = rating;
        if (review_text !== undefined) updates.review_text = review_text;
        // review.rating = rating ?? review.rating;
        // review.review_text = review_text ?? review.review_text;

        await review.update(updates);

        return res.status(200).json({
            success: true,
            message: 'Review Updated Successfully',
            review
        });

    } catch (err) {
        console.log('Error Occurred in editReview in controller/review.js', err);
        res.status(500).json(err);
    }
};

// Controller to Delete a Review Record
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const userId = req.user.user_id;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review Not Found' });
        }

        if (review.user_id !==userId) {
            return res.status(403).json({ error:'User is Not Authorized to Edit this Review' });
        }

        await review.destroy();

        res.status(200).json({
            success: true,
            message: 'Review Deleted Successfully'
        });

    } catch (err) {
        console.log('Error Occurred in deleteReview in controller/review.js', err);
        res.status(500).json(err);
    }
}