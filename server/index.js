const express = require('express');
require('dotenv').config();
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authrouter = require('./routes/auth-routes')
const adminproductroutes = require('./routes/admin/products-routes')
const adminOrdersroutes = require('./routes/admin/order-routes')
const shopProductsRouter = require('./routes/shop/products-route')
const shopCartsRouter = require('./routes/shop/cart-routes')
const shopAddressRouter = require('./routes/shop/address-routes')
const shopOrderRouter = require('./routes/shop/order-routes')
const shopSearchRouter = require('./routes/shop/search-routes')
const shopReviewRouter = require('./routes/shop/review-routes')
const shopPriceTrendRouter = require('./routes/shop/price-trend-routes')
const aiRoutes = require('./routes/ai-routes')
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Expires',
    'Pragma'
  ],
  credentials: true
}));

// API Routes
console.log('Setting up API routes...');
app.use('/api/auth', authrouter);
app.use('/api/admin/products', adminproductroutes);
app.use('/api/admin/order', adminOrdersroutes);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartsRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/reviews', shopReviewRouter);
app.use('/api/shop/price-trend', shopPriceTrendRouter);
app.use('/api/ai', aiRoutes);

// API 404 handler
app.get('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Serve static files
const frontendPath = path.join(__dirname, '..', 'fronted1', 'fronted2', 'dist');
app.use(express.static(frontendPath));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
