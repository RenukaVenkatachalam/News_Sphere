const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  newsApiId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  imageUrl: {
    type: String
  },
  source: {
    type: String
  },
  category: {
    type: String,
    enum: ['Technology', 'Politics', 'Business', 'Science', 'Health', 'Sports', 'Entertainment', 'General']
  },
  publishedAt: {
    type: Date
  },
  url: {
    type: String,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  activeReaders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
