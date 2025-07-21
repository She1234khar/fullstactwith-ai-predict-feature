import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md w-full text-center shadow-md animate-fade-in">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful</h2>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase! Your order has been placed successfully.
        </p>
        <Link
          to="/shop/account"
          className="inline-block px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition"
        >
          Go to Order Detail
        </Link>
      </div>
    </div>
  );
}
