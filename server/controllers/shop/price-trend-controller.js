const PriceHistory = require('../../models/PriceHistory');
const Product = require('../../models/Product');

// Get price history for a product (last 30 days)
const getPriceHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get price history for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const priceHistory = await PriceHistory.find({
      productId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    // If no history exists, create initial entry from current product
    // (Removed: Only real-time admin updates should create entries)
    // if (priceHistory.length === 0) {
    //   const product = await Product.findById(productId);
    //   if (product) {
    //     const initialEntry = new PriceHistory({
    //       productId,
    //       price: product.price,
    //       salePrice: product.salePrice
    //     });
    //     await initialEntry.save();
    //     priceHistory.push(initialEntry);
    //   }
    // }
    
    res.status(200).json({
      success: true,
      data: priceHistory
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching price history'
    });
  }
};

// Predict price trend and provide recommendation
const getPricePrediction = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get price history for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const priceHistory = await PriceHistory.find({
      productId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    if (priceHistory.length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          prediction: 'Insufficient data for prediction',
          recommendation: 'Buy Now',
          confidence: 'Low',
          priceHistory: priceHistory
        }
      });
    }
    
    // Calculate price changes
    const priceChanges = [];
    for (let i = 1; i < priceHistory.length; i++) {
      const currentPrice = priceHistory[i].salePrice || priceHistory[i].price;
      const previousPrice = priceHistory[i-1].salePrice || priceHistory[i-1].price;
      const change = currentPrice - previousPrice;
      priceChanges.push(change);
    }
    
    // Calculate average daily change
    const totalChange = priceChanges.reduce((sum, change) => sum + change, 0);
    const averageDailyChange = totalChange / priceChanges.length;
    
    // Predict price after 5 days
    const currentPrice = priceHistory[priceHistory.length - 1].salePrice || 
                        priceHistory[priceHistory.length - 1].price;
    const predictedPrice = currentPrice + (averageDailyChange * 5);
    
    // Determine recommendation
    let recommendation = 'Buy Now';
    let confidence = 'Medium';
    
    if (averageDailyChange < -2) {
      recommendation = '🕒 Wait for better deal';
      confidence = 'High';
    } else if (averageDailyChange > 2) {
      recommendation = '👍 Buy Now';
      confidence = 'High';
    } else if (averageDailyChange < 0) {
      recommendation = '🕒 Wait for better deal';
      confidence = 'Medium';
    } else {
      recommendation = '👍 Buy Now';
      confidence = 'Medium';
    }
    
    // Calculate trend percentage
    const trendPercentage = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    res.status(200).json({
      success: true,
      data: {
        currentPrice,
        predictedPrice: Math.round(predictedPrice * 100) / 100,
        trendPercentage: Math.round(trendPercentage * 100) / 100,
        averageDailyChange: Math.round(averageDailyChange * 100) / 100,
        recommendation,
        confidence,
        priceHistory: priceHistory.map(entry => ({
          date: entry.date,
          price: entry.price,
          salePrice: entry.salePrice,
          effectivePrice: entry.salePrice || entry.price
        }))
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error predicting price trend'
    });
  }
};

// Update price history when product price changes (called from product update)
const updatePriceHistory = async (productId, newPrice, newSalePrice) => {
  try {
    const priceEntry = new PriceHistory({
      productId,
      price: newPrice,
      salePrice: newSalePrice
    });
    await priceEntry.save();
  } catch (error) {
    console.log('Error updating price history:', error);
  }
};

module.exports = {
  getPriceHistory,
  getPricePrediction,
  updatePriceHistory
}; 