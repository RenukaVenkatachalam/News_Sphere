const axios = require("axios");
const Article = require("../models/Article");

const mapCategory = (newsApiCategory) => {
  const mapping = {
    business: "Business",
    entertainment: "Entertainment",
    general: "General",
    health: "Health",
    science: "Science",
    sports: "Sports",
    technology: "Technology",
  };

  return mapping[newsApiCategory?.toLowerCase()] || "General";
};

const fetchAndSyncNews = async (category = "general", search = "") => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      console.error("NEWS_API_KEY is missing in .env");
      return;
    }

    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    if (category && category.toLowerCase() !== "general") {
      url += `&category=${category.toLowerCase()}`;
    }

    if (search) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        search
      )}&apiKey=${apiKey}`;
    }

    console.log("Fetching news from:", url);

    const response = await axios.get(url);

    console.log("NewsAPI status:", response.data.status);
    console.log("Articles received:", response.data.articles?.length);

    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      console.log("No articles returned from NewsAPI");
      return;
    }

    const mappedCategory = mapCategory(category);

    for (const item of articles) {
      if (!item.url || !item.title) continue;

      const newsApiId = item.url;

      const articleData = {
        newsApiId,
        title: item.title,
        summary: item.description,
        imageUrl: item.urlToImage,
        source: item.source?.name,
        category: search ? "General" : mappedCategory,
        publishedAt: item.publishedAt,
        url: item.url,
      };

      await Article.findOneAndUpdate(
        { newsApiId },
        { $set: articleData },
        { upsert: true, returnDocument: 'after'}
      );
    }

    console.log("News successfully synced to MongoDB");
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error.message);
  }
};

module.exports = {
  fetchAndSyncNews,
};