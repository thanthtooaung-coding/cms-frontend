import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Receipt, CheckCircle, XCircle } from 'lucide-react';
import { ecsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';
import { useAuthDataStore } from '../../store/auth-store';

interface Refund {
  id: number;
  orderNumber: string;
  status: string;
  refundAmount: number;
  reason: string;
  createdAt: string;
}

export default function RefundsApp() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const { user } = useAuthDataStore();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = async () => {
    if (!tenantId) return;
    try {
      const response = await ecsApiFetch(`/refunds?tenantId=${tenantId}`);
      if (response.ok) {
        const result = await response.json();
        setRefunds(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchRefunds();
    }
  }, [tenantId]);

  const updateRefundStatus = async (refundId: number, status: string) => {
    if (!tenantId || !user) return;
    try {
      const response = await ecsApiFetch(`/refunds/${refundId}/status?status=${status}&approvedBy=${user.id}&tenantId=${tenantId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await fetchRefunds();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update refund status');
      }
    } catch (error) {
      console.error('Error updating refund status:', error);
      alert('An error occurred while updating the refund');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading refunds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Refunds</h1>
        <p className="text-slate-600">Manage customer refund requests</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'auto' }}>
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Receipt className="w-16 h-16 text-slate-400" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">No refund requests found</p>
                        <p className="text-sm text-slate-500 mt-1">Refund requests from customers will appear here when they request a refund.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                refunds.map((refund, index) => (
                  <tr key={refund.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-blue-600">{refund.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-semibold">
                      ${refund.refundAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md">
                      <p className="truncate" title={refund.reason}>{refund.reason}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {refund.status === 'PENDING' && (
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateRefundStatus(refund.id, 'APPROVED')}
                            className="h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateRefundStatus(refund.id, 'REJECTED')}
                            className="h-8"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

