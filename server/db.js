const mongoose = require('mongoose');

async function main() {
  try {
    if (!process.env.DB_KEY) {
      console.error('DB_KEY environment variable is not set');
      throw new Error('Database connection string not provided');
    }
    
    await mongoose.connect(process.env.DB_KEY);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Re-throw to prevent app from starting without DB
  }
}

module.exports = main;
