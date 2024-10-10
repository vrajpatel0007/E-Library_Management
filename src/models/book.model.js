const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    bookPrice: {
        type: Number,
        require: true,
      },
    available: {
        type: Boolean,
        default: true
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
}, {
    timestamps: true,
});


const Book = mongoose.model('Book', BookSchema);

module.exports = Book;