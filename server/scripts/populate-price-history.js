const mongoose = require('mongoose');
const PriceHistory = require('../models/PriceHistory');
const Product = require('../models/Product');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_KEY);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Generate sample price history for a product
const generateSamplePriceHistory = async (product, days = 30) => {
  const priceHistory = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // For the most recent day, use the product's current price and salePrice
    if (i === 0) {
      priceHistory.push({
        productId: product._id,
        price: product.price,
        salePrice: product.salePrice || null,
        date
      });
      continue;
    }

    // Generate realistic price variations for previous days
    const basePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = Math.round((basePrice * (1 + variation)) * 100) / 100;

    // Occasionally add sale prices
    const hasSale = Math.random() < 0.2; // 20% chance of sale
    const salePrice = hasSale ? Math.round(price * 0.8 * 100) / 100 : null;

    priceHistory.push({
      productId: product._id,
      price,
      salePrice,
      date
    });
  }

  return priceHistory;
};

// Populate price history for all products
const populatePriceHistory = async () => {
  try {
    console.log('Starting price history population...');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      console.log(`Processing product: ${product.title}`);

      // Always delete old price history for this product
      await PriceHistory.deleteMany({ productId: product._id });

      // Generate sample price history (last day = current product price/salePrice)
      const sampleHistory = await generateSamplePriceHistory(product);

      // Insert price history
      await PriceHistory.insertMany(sampleHistory);
      console.log(`Created ${sampleHistory.length} price history entries for ${product.title}`);
    }

    console.log('Price history population completed successfully!');
  } catch (error) {
    console.error('Error populating price history:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await populatePriceHistory();
  mongoose.connection.close();
  console.log('Script completed');
};

runScript(); 