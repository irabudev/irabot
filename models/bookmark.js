const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    url: String,
    thumbnail: String,
    category: String
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);