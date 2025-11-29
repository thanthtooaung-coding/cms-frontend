import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { ShoppingBag, CheckCircle, XCircle, Package } from 'lucide-react';
import { ecsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';

interface Order {
  id: number;
  orderNumber: string;
  userName: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersApp() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!tenantId) return;
    try {
      const response = await ecsApiFetch(`/orders?tenantId=${tenantId}`);
      if (response.ok) {
        const result = await response.json();
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchOrders();
    }
  }, [tenantId]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    if (!tenantId) return;
    try {
      const response = await ecsApiFetch(`/orders/${orderId}/status?status=${status}&tenantId=${tenantId}`, {
        method: 'PUT'
      });
      if (response.ok) {
        await fetchOrders();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">View and manage customer orders</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'auto' }}>
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ShoppingBag className="w-16 h-16 text-slate-400" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">No orders found</p>
                        <p className="text-sm text-slate-500 mt-1">Orders from your customers will appear here once they start making purchases.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-blue-600">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {order.orderStatus === 'PENDING' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                              className="h-8"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                              className="h-8"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.orderStatus === 'CONFIRMED' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            className="h-8"
                          >
                            <Package className="w-3 h-3 mr-1" />
                            Ship
                          </Button>
                        )}
                        {order.orderStatus === 'SHIPPED' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                            className="h-8"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Delivered
                          </Button>
                        )}
                      </div>
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

