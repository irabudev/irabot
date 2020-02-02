const mongoose = require('mongoose');

const chuckSchema = new mongoose.Schema({
  categories: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  icon_url: String,
  id: String,
  updated_at:  {
    type: Date,
    default: Date.now,
  },
  ulr: String,
  value: String
});

module.exports = mongoose.model('ChuckNorios', chuckSchema);