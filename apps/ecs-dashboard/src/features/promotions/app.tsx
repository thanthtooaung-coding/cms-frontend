import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Gift, Plus, Edit, Trash2 } from 'lucide-react';
import { ecsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';
import { PromotionForm } from './components/PromotionForm';

interface Promotion {
  id: number;
  name: string;
  code: string;
  promotionType: string;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
  active?: boolean; // Handle both naming conventions
}

export default function PromotionsApp() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    if (!tenantId) return;
    try {
      const response = await ecsApiFetch(`/promotions?tenantId=${tenantId}`);
      if (response.ok) {
        const result = await response.json();
        // Normalize the data to ensure isActive is always set correctly
        const normalizedPromotions = (result.data || []).map((promotion: any) => ({
          ...promotion,
          isActive: promotion.isActive ?? promotion.active ?? false,
        }));
        setPromotions(normalizedPromotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchPromotions();
    }
  }, [tenantId]);

  const handleAdd = () => {
    setSelectedPromotion(null);
    setFormOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormOpen(true);
  };

  const handleDelete = async (promotionId: number) => {
    if (!tenantId) return;
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const response = await ecsApiFetch(`/promotions/${promotionId}?tenantId=${tenantId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchPromotions();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete promotion');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('An error occurred while deleting the promotion');
    }
  };

  const formatPromotionType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Promotions</h1>
          <p className="text-slate-600">Manage discounts and special offers</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Promotion
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'auto' }}>
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Gift className="w-16 h-16 text-slate-400" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">No promotions found</p>
                        <p className="text-sm text-slate-500 mt-1">Create your first promotion to attract more customers and boost sales.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((promotion, index) => (
                  <tr key={promotion.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-blue-600">{promotion.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{promotion.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatPromotionType(promotion.promotionType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-semibold">
                      {promotion.promotionType === 'PERCENTAGE_DISCOUNT' 
                        ? `${promotion.discountValue}%` 
                        : `$${promotion.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        promotion.isActive
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(promotion)}
                          className="h-8"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(promotion.id)}
                          className="h-8"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PromotionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        promotion={selectedPromotion}
        tenantId={tenantId}
        onSuccess={fetchPromotions}
      />
    </div>
  );
}
