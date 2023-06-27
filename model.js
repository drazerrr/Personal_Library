const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true
    },
    comments: [String]
});

    const Book = mongoose.model('Book', BooksSchema);

exports.Book = Book;