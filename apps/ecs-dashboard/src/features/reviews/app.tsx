import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Star } from 'lucide-react';
import { ecsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';

interface Review {
  id: number;
  userName: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsApp() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const fetchReviews = async () => {
      try {
        const response = await ecsApiFetch(`/reviews/tenant/${tenantId}`);
        if (response.ok) {
          const result = await response.json();
          setReviews(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [tenantId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Reviews</h1>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-slate-50">
          <Star className="w-16 h-16 text-slate-400 mb-4" />
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">No reviews found</p>
            <p className="text-sm text-slate-500 mt-1">Product reviews from your customers will appear here once they start leaving feedback.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{review.productName}</h3>
                  <p className="text-sm text-gray-600">by {review.userName}</p>
                </div>
                <div className="text-yellow-500">{'★'.repeat(review.rating)}</div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

