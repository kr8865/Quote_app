const express = require('express');
const {
    getQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    toggleFavorite,
    getMyQuotes
} = require('../controllers/quoteController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getQuotes)
    .post(protect, createQuote);

router.route('/:id')
    .put(protect, updateQuote)
    .delete(protect, deleteQuote);

router.get('/myquotes', protect, getMyQuotes);
router.put('/:id/favorite', protect, toggleFavorite);

module.exports = router;
