const express = require('express');
const { askGemini } = require('../helpers/gemini');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const router = express.Router();

// 1. Product Q&A
router.post('/qa', async (req, res) => {
  const { productId, question } = req.body;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId }).limit(5);
  const prompt = `
You are an expert e-commerce assistant. Answer the user's question about the product below as helpfully, creatively, and informatively as possible—even if some information is missing. If the user asks for a summary, discount, quality, or anything else, try to answer in detail using all available info, and add general positive points if needed. If the user asks in Hinglish or Hindi, reply in the same language.

Product Details:
Title: ${product.title}
Description: ${product.description}
Category: ${product.category}
Brand: ${product.brand}
Price: ${product.price}
Sale Price: ${product.salePrice}
Stock: ${product.totalStock}
Average Rating: ${product.averageRating}
Total Reviews: ${product.totalReviews}
Recent Reviews: ${reviews.map(r => r.comment).join('\n')}

User's Question: ${question}

Answer (be creative, detailed, and match the user's language):
`;
  const answer = await askGemini(prompt);
  res.json({ answer });
});

// 2. Product Summary
router.get('/summary/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId }).limit(5);
  const prompt = `
You are an expert e-commerce assistant. Write a friendly, engaging, and helpful summary for the following product, even if the information is limited. If details are missing, highlight general strengths (like quality, reliability, or versatility) and encourage the user to consider the product. Make the summary at least 2-3 sentences.

Product details:
Title: ${product.title}
Description: ${product.description}
Category: ${product.category}
Brand: ${product.brand}
Price: ${product.price}
Sale Price: ${product.salePrice}
Stock: ${product.totalStock}
Average Rating: ${product.averageRating}
Total Reviews: ${product.totalReviews}
Recent Reviews: ${reviews.map(r => r.comment).join('\n')}
`;
  let summary = await askGemini(prompt);
  summary = summary.trim();
  if (summary.length < 40 || summary.toLowerCase().includes('very little information')) {
    summary += ' This product is known for its reliability and is a great choice for everyday use.';
  }
  res.json({ summary });
});

// 3. Smart Search
router.post('/search', async (req, res) => {
  const { query } = req.body;
  const prompt = `Convert this user search into product filters for an e-commerce site. Available categories: men, women, kids, accessories, footwear. Query: "${query}". Respond as JSON with keys: category, brand, minPrice, maxPrice.`;
  const filters = await askGemini(prompt);
  res.json({ filters });
});

// 4. Product Recommendations
router.post('/recommend', async (req, res) => {
  const { interest, category, brand, priceRange } = req.body;
  // Fetch products based on interest/category/brand/priceRange, or all if not specified
  let query = {};
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (priceRange && priceRange.min != null && priceRange.max != null) {
    query.price = { $gte: priceRange.min, $lte: priceRange.max };
  }
  const products = await Product.find(query).limit(10);
  const prompt = `You are an expert e-commerce assistant. Based on the following products and user interest, recommend 3 products. Be creative, mention why each product is a good fit, and use available details.\nUser interest: ${interest || 'Not specified'}\nProducts: ${products.map(p => `Title: ${p.title}, Description: ${p.description}, Category: ${p.category}, Brand: ${p.brand}, Price: ${p.price}, Sale Price: ${p.salePrice}, Stock: ${p.totalStock}, Rating: ${p.averageRating}`).join('\n')}\nRecommendations:`;
  const recommendations = await askGemini(prompt);
  res.json({ recommendations });
});

// 5. AI Chatbot
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = `You are a helpful e-commerce chatbot. Answer the user's question conversationally, using available product, order, and policy info. If the user asks about orders, returns, discounts, or product details, answer as best as possible. If you don't know, politely say so.\nUser: ${message}\nChatbot:`;
  const answer = await askGemini(prompt);
  res.json({ answer });
});

// 6. Category-wise Discount Finder
router.get('/discounts', async (req, res) => {
  // Find all products with a sale price lower than price using aggregation
  const discountedProducts = await Product.aggregate([
    {
      $match: {
        salePrice: { $ne: null },
        $expr: { $lt: ["$salePrice", "$price"] }
      }
    }
  ]);
  // Group by category
  const categoryMap = {};
  discountedProducts.forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = [];
    categoryMap[p.category].push(p.title);
  });
  const prompt = `List all categories where products are currently on discount, and mention a few discounted products in each category.\nDiscounted categories and products: ${Object.entries(categoryMap).map(([cat, titles]) => `Category: ${cat}, Products: ${titles.join(', ')}`).join('\n')}\nGive a user-friendly summary.`;
  const summary = await askGemini(prompt);
  res.json({ summary, categoryMap });
});

// 7. AI Review Summary
router.get('/review-summary/:productId', async (req, res) => {
  const { productId } = req.params;
  // Fetch top 15 reviews for the product
  const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(15);
  const prompt = `Summarize the following product reviews for a customer. Highlight what most users liked and disliked. Be concise and user-friendly.\n\nReviews:\n${reviews.map(r => `- ${r.comment}`).join('\n')}`;
  const summary = await askGemini(prompt);
  res.json({ summary });
});

module.exports = router; 