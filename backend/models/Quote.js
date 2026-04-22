const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add quote content'],
        trim: true,
        maxlength: [500, 'Quote cannot be more than 500 characters']
    },
    author: {
        type: String,
        required: [true, 'Please add the author of the quote'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Inspirational', 'Life', 'Success', 'Love', 'Wisdom', 'Humor', 'Other']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    favoritesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
