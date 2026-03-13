const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const { fetchAndSyncNews } = require("../services/newsApiService");

// @desc    Get all articles (latest news)
// @route   GET /api/news
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    // Fire and forget news API sync
    fetchAndSyncNews(category, search).catch(console.error);

    let query = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } }
      ];
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json(articles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get trending articles
// @route   GET /api/news/trending
// @access  Public
router.get("/trending", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ viewCount: -1 })
      .limit(5);

    res.json(articles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get single article
// @route   GET /api/news/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Increment view count
// @route   POST /api/news/:id/view
// @access  Public
router.post("/:id/view", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ viewCount: article.viewCount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;