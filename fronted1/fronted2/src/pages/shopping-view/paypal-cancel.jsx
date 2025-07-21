import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '@/store/shop/order-slice';

export default function PaypalCancel() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get the order ID from session storage
    const currentOrderId = sessionStorage.getItem('currentOrderId');
    
    if (currentOrderId) {
      // Cancel the order in the backend
      dispatch(cancelOrder(JSON.parse(currentOrderId)));
    }
    
    // Clean up session storage when payment is cancelled
    sessionStorage.removeItem('currentOrderId');
  }, [dispatch]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-md animate-fade-in">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-700 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-3">
          <Link
            to="/shop/checkout"
            className="inline-block px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition w-full"
          >
            Try Again
          </Link>
          <Link
            to="/shop/home"
            className="inline-block px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 transition w-full"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 