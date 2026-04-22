const Quote = require('../models/Quote');
const User = require('../models/User');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
exports.getQuotes = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['search', 'sort'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        query = Quote.find(JSON.parse(queryStr)).populate({
            path: 'user',
            select: 'username'
        });

        // Search logic (case insensitive regex search on content and author)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = query.find({
                $or: [
                    { content: searchRegex },
                    { author: searchRegex }
                ]
            });
        }

        // Sort logic
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default sort newest first
        }

        const quotes = await query;

        res.status(200).json({
            success: true,
            count: quotes.length,
            data: quotes
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new quote
// @route   POST /api/quotes
// @access  Private
exports.createQuote = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const quote = await Quote.create(req.body);

        res.status(201).json({
            success: true,
            data: quote
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Private
exports.updateQuote = async (req, res, next) => {
    try {
        let quote = await Quote.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }

        // Make sure user is quote owner
        if (quote.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this quote. Only the creator can edit it.' });
        }

        quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: quote
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private
exports.deleteQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }

        // Make sure user is quote owner
        if (quote.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this quote. Only the creator can delete it.' });
        }

        await quote.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Toggle favorite quote
// @route   PUT /api/quotes/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        let quote = await Quote.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }

        const isFavorited = user.favorites.includes(quote._id);

        if (isFavorited) {
            // Remove from favorites
            user.favorites = user.favorites.filter(
                fav => fav.toString() !== quote._id.toString()
            );
            quote.favoritesCount -= 1;
        } else {
            // Add to favorites
            user.favorites.push(quote._id);
            quote.favoritesCount += 1;
        }

        await user.save();
        await quote.save();

        res.status(200).json({
            success: true,
            data: {
                isFavorited: !isFavorited,
                favoritesCount: quote.favoritesCount
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get user's quotes
// @route   GET /api/quotes/myquotes
// @access  Private
exports.getMyQuotes = async (req, res, next) => {
    try {
        const quotes = await Quote.find({ user: req.user.id }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: quotes.length,
            data: quotes
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
