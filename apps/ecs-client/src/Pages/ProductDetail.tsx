import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Textarea } from '@cms/ui/components/textarea';
import { Label } from '@cms/ui/components/label';
import { AlertCircle, CheckCircle, X, Star } from 'lucide-react';
import { ecsApiFetch } from '../utils/apiClient';
import { useTenant } from '../context/TenantContext';
import { useAuthDataStore } from '../store/auth-store';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName?: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetail() {
  const { id, tenantSlug } = useParams<{ id: string; tenantSlug?: string }>();
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  const { user } = useAuthDataStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId || !id) return;
      try {
        const [productRes, reviewsRes] = await Promise.all([
          ecsApiFetch(`/products/${id}?tenantId=${tenantId}`),
          ecsApiFetch(`/reviews/product/${id}`)
        ]);

        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData.data);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, tenantId]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate(`${basePath}/login`);
      return;
    }

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate quantity
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    if (quantity > product!.stock) {
      setError(`Insufficient stock. Only ${product!.stock} items available.`);
      return;
    }

    try {
      const response = await ecsApiFetch(`/cart?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify({ productId: parseInt(id!), quantity })
      });

      if (response.ok) {
        setSuccess('Product added to cart successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('An error occurred while adding the product to cart. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate(`${basePath}/login`);
      return;
    }

    // Clear previous messages
    setReviewError(null);
    setReviewSuccess(null);

    // Validation
    if (reviewRating === 0) {
      setReviewError('Please select a rating');
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError('Please write a review comment');
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await ecsApiFetch(`/reviews?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify({
          productId: parseInt(id!),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });

      if (response.ok) {
        setReviewSuccess('Review submitted successfully!');
        setReviewRating(0);
        setReviewComment('');
        
        // Refresh reviews
        const reviewsRes = await ecsApiFetch(`/reviews/product/${id}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.data || []);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setReviewSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setReviewError(errorData.message || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('An error occurred while submitting your review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center bg-slate-50 rounded-lg p-4">
          <img 
            src={product.imageUrl || '/placeholder.svg'} 
            alt={product.name}
            className="w-full h-auto max-h-[600px] rounded-lg object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <label className="block mb-2">Quantity</label>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value) || 1;
                setQuantity(newQuantity);
                // Clear error when user changes quantity
                if (error) setError(null);
              }}
              className="w-32"
            />
            <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Button onClick={handleAddToCart} className="w-full mb-4">
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        {/* Review Form - Only show if user is logged in */}
        {user && (
          <div className="border p-6 rounded-lg mb-6 bg-slate-50">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-1 ${
                        star <= reviewRating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      } transition-colors`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="ml-2 text-sm text-slate-600">
                      {reviewRating} {reviewRating === 1 ? 'star' : 'stars'}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="reviewComment">Your Review</Label>
                <Textarea
                  id="reviewComment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="mt-2"
                  rows={4}
                />
              </div>
              
              {reviewError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{reviewError}</p>
                </div>
              )}
              
              {reviewSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{reviewSuccess}</p>
                </div>
              )}
              
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="border p-8 rounded-lg text-center bg-slate-50">
            <p className="text-slate-600 text-lg">No reviews yet</p>
            <p className="text-slate-500 text-sm mt-2">
              {user ? 'Be the first to review this product!' : 'Login to write a review'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border p-4 rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{review.userName}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-slate-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

