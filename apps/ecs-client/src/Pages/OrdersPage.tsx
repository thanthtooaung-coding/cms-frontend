import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { ecsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';
import { useTenant } from '../context/TenantContext';

interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { user } = useAuthDataStore();
  const { tenantId } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    if (!user || !tenantId) return;

    const fetchOrders = async () => {
      try {
        const response = await ecsApiFetch(`/orders/my-orders?userId=${user.id}&tenantId=${tenantId}`);
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
    fetchOrders();
  }, [user, tenantId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You have no orders yet</p>
          <Link to={`${basePath}/products`}>
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Status: <span className="font-semibold">{order.orderStatus}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.totalAmount}</p>
                  <Link to={`${basePath}/order/${order.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

