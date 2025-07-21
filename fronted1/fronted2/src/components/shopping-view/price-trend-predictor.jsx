import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus, Clock, ThumbsUp } from 'lucide-react';
import { fetchPricePrediction, clearPriceData } from '@/store/shop/price-trend-slice';

export default function PriceTrendPredictor({ productId }) {
  const dispatch = useDispatch();
  const { priceData, loading, error } = useSelector((state) => state.priceTrendSlice);

  useEffect(() => {
    if (productId) {
      dispatch(fetchPricePrediction(productId));
    }
    
    return () => {
      dispatch(clearPriceData());
    };
  }, [productId, dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTrendIcon = (trendPercentage) => {
    if (trendPercentage > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trendPercentage < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation.includes('Buy Now')) return <ThumbsUp className="w-4 h-4 text-green-600" />;
    if (recommendation.includes('Wait')) return <Clock className="w-4 h-4 text-orange-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Smart Price Trend Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Smart Price Trend Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!priceData) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
         Smart Price Trend Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price and Prediction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-xl font-bold text-green-600">${priceData.currentPrice}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Predicted (5 days)</p>
            <p className="text-xl font-bold text-blue-600">${priceData.predictedPrice}</p>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getTrendIcon(priceData.trendPercentage)}
            <span className="font-medium">Price Trend</span>
          </div>
          <Badge variant={priceData.trendPercentage > 0 ? "destructive" : "default"}>
            {priceData.trendPercentage > 0 ? '+' : ''}{priceData.trendPercentage}%
          </Badge>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">AI Recommendation</h3>
            {getRecommendationIcon(priceData.recommendation)}
          </div>
          <p className="text-lg font-bold text-center">
            {priceData.recommendation}
          </p>
          <p className="text-sm text-gray-600 text-center mt-1">
            Confidence: {priceData.confidence}
          </p>
        </div>

        {/* Price History Chart */}
        {priceData.priceHistory && priceData.priceHistory.length > 1 && (
          <div className="mt-4">
            <h4 className="font-medium mb-3">Last 30 Days Price History</h4>
            <div className="h-32 bg-gray-50 rounded-lg p-3 relative">
              <div className="flex items-end justify-between h-full">
                {priceData.priceHistory.map((entry, index) => {
                  const maxPrice = Math.max(...priceData.priceHistory.map(e => e.effectivePrice));
                  const minPrice = Math.min(...priceData.priceHistory.map(e => e.effectivePrice));
                  const priceRange = maxPrice - minPrice;
                  const height = priceRange > 0 ? ((entry.effectivePrice - minPrice) / priceRange) * 100 : 50;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-2 bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                        title={`${formatDate(entry.date)}: $${entry.effectivePrice}`}
                      ></div>
                      {index % 5 === 0 && (
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDate(entry.date)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center">
          <p> Based on historical price data and trend analysis</p>
          <p> Predictions are estimates and may vary</p>
        </div>
      </CardContent>
    </Card>
  );
} 