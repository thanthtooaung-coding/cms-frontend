import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { ecsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';
import { useTenant } from '../context/TenantContext';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

export default function CartPage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthDataStore();
  const { tenantId } = useTenant();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user) return;
    try {
      const response = await ecsApiFetch(`/cart/${cartItemId}?quantity=${quantity}&userId=${user.id}`, {
        method: 'PUT'
      });
      if (response.ok) {
        const result = await response.json();
        setCartItems(cartItems.map(item => 
          item.id === cartItemId ? result.data : item
        ));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!user) return;
    try {
      await ecsApiFetch(`/cart/${cartItemId}?userId=${user.id}`, {
        method: 'DELETE'
      });
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to={`${basePath}/products`}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 border p-4 rounded">
                <img src={item.productImageUrl || '/placeholder.svg'} alt={item.productName} className="w-24 h-24 object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-gray-600">${item.productPrice}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="font-bold">${item.totalPrice}</p>
                <Button variant="destructive" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total: ${total}</span>
            </div>
            <Link to={`${basePath}/checkout`}>
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

