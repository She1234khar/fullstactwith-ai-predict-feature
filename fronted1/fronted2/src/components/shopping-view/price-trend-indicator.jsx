import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PriceTrendIndicator({ productId }) {
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchTrend();
    }
    // eslint-disable-next-line
  }, [productId]);

  const fetchTrend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/shop/price-trend/prediction/${productId}`);
      const data = await response.json();
      
      if (data.success && data.data.trendPercentage !== undefined) {
        setTrend(data.data.trendPercentage);
      }
    } catch (err) {
      console.error('Error fetching trend:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || trend === null) {
    return null;
  }

  const getTrendIcon = () => {
    if (trend > 1) return <TrendingUp className="w-3 h-3 text-red-500" />;
    if (trend < -1) return <TrendingDown className="w-3 h-3 text-green-500" />;
    return <Minus className="w-3 h-3 text-gray-500" />;
  };

  const getTrendText = () => {
    if (trend > 1) return 'Rising';
    if (trend < -1) return 'Falling';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (trend > 1) return 'text-red-600';
    if (trend < -1) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
      {getTrendIcon()}
      <span>{getTrendText()}</span>
    </div>
  );
} 