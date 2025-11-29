import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { ecsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';
import { useTenant } from '../context/TenantContext';

interface CartItem {
  id: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthDataStore();
  const { tenantId } = useTenant();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [promotionCode, setPromotionCode] = useState('');
  const [loading, setLoading] = useState(true);
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    if (!user) {
      navigate(`${basePath}/login`);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await ecsApiFetch(`/cart?userId=${user.id}`);
        if (response.ok) {
          const result = await response.json();
          setCartItems(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate, basePath]);

  const handleCheckout = async () => {
    if (!user || !tenantId) return;

    try {
      const response = await ecsApiFetch(`/orders/checkout?userId=${user.id}&tenantId=${tenantId}`, {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress,
          billingAddress,
          paymentMethod,
          promotionCode: promotionCode || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`${basePath}/order/${result.data.id}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <Label>Shipping Address</Label>
              <Input
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter shipping address"
              />
            </div>
            <div>
              <Label>Billing Address</Label>
              <Input
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter billing address"
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <Label>Promotion Code (Optional)</Label>
              <Input
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
                placeholder="Enter promotion code"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded p-4 space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.productName} x {item.quantity}</span>
                <span>${item.totalPrice}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleCheckout} className="w-full mt-4">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}

