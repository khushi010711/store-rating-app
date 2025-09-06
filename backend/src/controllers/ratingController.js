
const ratingService = require('../services/ratingService');

const submitRating = async (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating_value } = req.body;

    try {
        const rating = await ratingService.submitOrUpdateRating(userId, storeId, rating_value);
        res.status(200).json({ message: 'Rating submitted successfully.', rating });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ message: 'Server error submitting rating.' });
    }
};

module.exports = {
    submitRating,
};