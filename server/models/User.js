const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  savedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  preferredCategories: [{
    type: String,
    enum: ['Technology', 'Politics', 'Business', 'Science', 'Health', 'Sports', 'Entertainment', 'General']
  }]
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;
