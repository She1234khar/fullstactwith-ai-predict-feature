import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star } from 'lucide-react'; // ⭐️ Star icon
import { setProductDetails } from '@/store/shop/product-slice';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews } from '@/store/shop/review-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import ReviewForm from './review-form';
import ReviewList from './review-list';
import RatingDisplay from './rating-display';
import PriceTrendPredictor from './price-trend-predictor';
import { askProductQuestion, getProductSummary, getReviewSummary } from '@/api/ai';

export default function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { reviews, averageRating, totalReviews, isLoading } = useSelector((state) => state.reviewSlice);
  const { user } = useSelector((state) => state.auth);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [reviewSummary, setReviewSummary] = useState('');
  
  console.log(productDetails, 'detail');

  useEffect(() => {
    if (open && productDetails?._id) {
      dispatch(getProductReviews(productDetails._id));
      getProductSummary(productDetails._id).then(res => setSummary(res.summary));
      getReviewSummary(productDetails._id).then(res => setReviewSummary(res.summary));
    }
  }, [open, productDetails?._id, dispatch]);

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setShowReviewForm(false);
  }

  const handleReviewAdded = () => {
    // Refresh reviews after adding a new one
    dispatch(getProductReviews(productDetails._id));
    setShowReviewForm(false);
  };

  // Check if user has already reviewed this product
  const userHasReviewed = user && reviews.some(review => review.userId === user.id);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAnswer('Loading...');
    const res = await askProductQuestion(productDetails._id, question);
    setAnswer(res.answer);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">

        {/* LEFT: Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="grid gap-6">
          <DialogTitle className="text-3xl font-extrabold">{productDetails?.title}</DialogTitle>

          {/* Rating Display */}
          <RatingDisplay 
            rating={averageRating} 
            totalReviews={totalReviews} 
            size="lg"
          />

          <p className="text-muted-foreground">{productDetails?.description}</p>

          <div className="flex items-center gap-4 text-2xl font-bold">
            <span className={productDetails?.salePrice > 0 ? 'line-through text-muted-foreground' : 'text-green-600'}>
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-red-600">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>

          <Button 
            className="w-full md:w-auto"
            onClick={() => {
              if (user) {
                dispatch(addToCart({ 
                  userId: user.id, 
                  productId: productDetails._id, 
                  quantity: 1 
                })).then((data) => {
                  if (data.payload?.success) {
                    dispatch(fetchCartItems(user.id));
                    toast.success('Successfully added to cart');
                  } else {
                    toast.error(data.payload?.message || 'Failed to add to cart');
                  }
                }).catch((error) => {
                  toast.error(error.message || 'Failed to add to cart');
                });
              } else {
                toast.error('Please login to add items to cart');
              }
            }}
          >
            Add to Cart
          </Button>

          {/* Price Trend Predictor */}
          <PriceTrendPredictor productId={productDetails?._id} />

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              {user && !userHasReviewed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </Button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-6">
                <ReviewForm 
                  productId={productDetails?._id} 
                  onReviewAdded={handleReviewAdded}
                />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              <ReviewList />
            </div>

            {/* No reviews message */}
            {!isLoading && reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews yet. Be the first to review this product!</p>
                {user && (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write the First Review
                  </Button>
                )}
              </div>
            )}

            {/* AI Review Summary */}
            <div className="mt-8">
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold mr-2">AI Review Summary</span>
                <span role="img" aria-label="AI">🤖</span>
              </div>
              <div className="bg-blue-50 text-blue-900 rounded p-4 shadow-sm min-h-[40px]">
                {reviewSummary || 'Loading...'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Product Summary (AI):</h3>
            <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{summary || 'Loading...'}</div>
          </div>
          <div style={{ marginTop: 24 }}>
            <h3>Ask a Question (AI):</h3>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask about this product..."
              style={{ width: '70%', marginRight: 8 }}
            />
            <button onClick={handleAsk}>Ask</button>
            {answer && <div style={{ marginTop: 8, background: '#e0e0e0', padding: 8, borderRadius: 4 }}>{answer}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
