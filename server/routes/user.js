const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const { protect } = require('../middleware/authMiddleware');

// @desc    Toggle save article
// @route   POST /api/user/save/:articleId
// @access  Private
router.post('/save/:articleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const articleId = req.params.articleId;

    // Check if article exists in db
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const isSaved = user.savedArticles.includes(articleId);

    if (isSaved) {
      // Remove from saved
      user.savedArticles = user.savedArticles.filter(
        (id) => id.toString() !== articleId
      );
    } else {
      // Add to saved
      user.savedArticles.push(articleId);
    }

    await user.save();
    
    // Populate before sending back updated list
    await user.populate('savedArticles');

    res.json(user.savedArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get saved articles
// @route   GET /api/user/saved
// @access  Private
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedArticles');
    res.json(user.savedArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user preferences
// @route   PATCH /api/user/preferences
// @access  Private
router.patch('/preferences', protect, async (req, res) => {
  try {
    const { preferredCategories } = req.body;

    if (!Array.isArray(preferredCategories)) {
      return res.status(400).json({ message: 'Categories must be an array' });
    }

    const user = await User.findById(req.user.id);
    user.preferredCategories = preferredCategories;
    await user.save();

    res.json(user.preferredCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
