import React from 'react';
import { Star, StarOff, Edit, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, updateReview } from '@/store/shop/review-slice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ReviewList() {
  const dispatch = useDispatch();
  const { reviews, isLoading } = useSelector((state) => state.reviewSlice);
  const { user } = useSelector((state) => state.auth);
  const [editingReview, setEditingReview] = React.useState(null);
  const [editComment, setEditComment] = React.useState('');
  const [editRating, setEditRating] = React.useState(0);

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditComment('');
    setEditRating(0);
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      await dispatch(updateReview({
        reviewId,
        reviewData: {
          rating: editRating,
          comment: editComment,
          userId: user.id
        }
      })).unwrap();
      
      toast.success('Review updated successfully!');
      setEditingReview(null);
      setEditComment('');
      setEditRating(0);
    } catch (error) {
      toast.error(error.message || 'Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await dispatch(deleteReview({ reviewId, userId: user.id })).unwrap();
      toast.success('Review deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-400">
        {index < rating ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-6 last:border-b-0">
          {editingReview === review._id ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit(review._id)}
                    disabled={!editComment.trim() || editRating === 0}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
              
              {/* Rating Stars for Edit */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="text-xl text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    {star <= editRating ? <Star className="fill-current" /> : <StarOff />}
                  </button>
                ))}
              </div>
              
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {editComment.length}/500 characters
              </p>
            </div>
          ) : (
            // Display Mode
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                
                {/* Edit/Delete buttons for review owner */}
                {user && user.id === review.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-1 mb-2">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 