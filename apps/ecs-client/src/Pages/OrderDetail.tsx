import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cms/ui/components/dialog';
import { AlertCircle, CheckCircle, X, CreditCard } from 'lucide-react';
import { ecsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';
import { useTenant } from '../context/TenantContext';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export default function OrderDetail() {
  const { id, tenantSlug } = useParams<{ id: string; tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthDataStore();
  const { tenantId } = useTenant();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    if (!user || !tenantId || !id) return;

    const fetchOrder = async () => {
      try {
        const response = await ecsApiFetch(`/orders/${id}?userId=${user.id}&tenantId=${tenantId}`);
        if (response.ok) {
          const result = await response.json();
          setOrder(result.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, tenantId]);

  const handlePayment = async () => {
    if (!order || !tenantId) return;

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill in all payment details');
      return;
    }

    // Simple card number validation (should be 16 digits)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    // Simple CVV validation (should be 3-4 digits)
    if (cvv.length < 3 || cvv.length > 4) {
      setError('CVV must be 3-4 digits');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status to PAID
      const response = await ecsApiFetch(`/orders/${order.id}/payment-status?status=PAID&tenantId=${tenantId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        setSuccess('Payment processed successfully!');
        setPaymentDialogOpen(false);
        // Refresh order data
        const orderResponse = await ecsApiFetch(`/orders/${order.id}?userId=${user?.id}&tenantId=${tenantId}`);
        if (orderResponse.ok) {
          const result = await orderResponse.json();
          setOrder(result.data);
        }
        // Clear form
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('An error occurred while processing payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleRequestRefund = async () => {
    if (!order) return;
    const reason = prompt('Please enter reason for refund:');
    if (!reason) return;

    // Clear previous messages
    setError(null);
    setSuccess(null);

    try {
      const response = await ecsApiFetch(`/refunds?userId=${user?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          orderId: order.id,
          reason
        })
      });

      if (response.ok) {
        setSuccess('Refund requested successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to request refund. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
      setError('An error occurred while requesting refund. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Order #{order.orderNumber}</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Order Status</h3>
          <p className={`font-medium ${
            order.orderStatus === 'CONFIRMED' ? 'text-green-600' :
            order.orderStatus === 'CANCELLED' ? 'text-red-600' :
            order.orderStatus === 'SHIPPED' ? 'text-blue-600' :
            order.orderStatus === 'DELIVERED' ? 'text-purple-600' :
            'text-slate-600'
          }`}>{order.orderStatus}</p>
          <h3 className="font-semibold mb-2 mt-4">Payment Status</h3>
          <p className={`font-medium ${
            order.paymentStatus === 'PAID' ? 'text-green-600' :
            order.paymentStatus === 'PENDING' ? 'text-yellow-600' :
            order.paymentStatus === 'FAILED' ? 'text-red-600' :
            'text-slate-600'
          }`}>{order.paymentStatus}</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm">{order.shippingAddress}</p>
          <h3 className="font-semibold mb-2 mt-4">Payment Method</h3>
          <p className="text-sm">{order.paymentMethod}</p>
        </div>
      </div>

      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-2">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.productName} x {item.quantity}</span>
              <span>${item.totalPrice}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {order.paymentStatus === 'PENDING' && (
          <Button onClick={() => setPaymentDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </Button>
        )}
        {order.orderStatus !== 'CANCELLED' && order.paymentStatus === 'PAID' && (
          <Button variant="outline" onClick={handleRequestRefund}>
            Request Refund
          </Button>
        )}
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Enter your payment details to complete the order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setCardNumber(formatted);
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    setExpiryDate(value);
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCvv(value);
                  }}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={processingPayment}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {processingPayment ? 'Processing...' : 'Pay Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

