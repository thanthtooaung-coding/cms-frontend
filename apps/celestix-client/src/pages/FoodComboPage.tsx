import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodComboCard } from "@/components/movies/FoodComboCard";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

// Checkout Modal Component
const CheckoutModal = ({ totalPrice, onCheckout, onCancel }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleCheckoutClick = () => {
    onCheckout(cardDetails);
  };

  return (
    // Added z-50 to ensure the modal is on top of other content
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg text-white w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="mb-4">
          <p className="text-lg">Total Price: <span className="font-bold text-primary">{totalPrice.toFixed(2)} Ks</span></p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            className="w-full bg-input text-white p-2 rounded border border-border/50 focus:ring-primary focus:border-primary"
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
            className="w-full bg-input text-white p-2 rounded border border-border/50 focus:ring-primary focus:border-primary"
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={cardDetails.cvc}
            onChange={handleInputChange}
            className="w-full bg-input text-white p-2 rounded border border-border/50 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-gradient-accent" onClick={handleCheckoutClick}>
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export const FoodComboPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [combos, setCombos] = useState([]);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);


  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    if (quantity === 0) {
      const newCart = { ...cart };
      delete newCart[id];
      setCart(newCart);
    } else {
      setCart({ ...cart, [id]: quantity });
    }
  };

  // REWRITTEN to handle prefixed IDs
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [prefixedId, quantity]) => {
      const [type, id] = prefixedId.split('_');
      
      if (type === 'combo') {
        const combo = combos.find((c) => c.id.toString() === id);
        return total + (combo ? combo.price * quantity : 0);
      } else if (type === 'food') {
        const food = foods.find((f) => f.id.toString() === id);
        return total + (food ? food.price * quantity : 0);
      }
      return total;
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  // REWRITTEN to correctly build the payload from prefixed IDs
  const handleCheckout = async (cardDetails) => {
    setLoading(true);

    // Build the payload by parsing the prefixed IDs from the cart
    const items = Object.entries(cart).map(([prefixedId, quantity]) => {
      const [type, id] = prefixedId.split('_');
      return {
          id,
          quantity,
          type // This will be either 'food' or 'combo'
      };
    });

    try {
      const response = await fetchWithAuth("/food-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, cardDetails }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data.paymentStatus === 'SUCCESS') {
            alert("Payment Successful! Your order is confirmed.");
            setCart({});
            setCheckoutOpen(false);
        } else {
            alert("Payment Failed. Please check your card details and try again.");
        }
      } else {
        const error = await response.json();
        alert(`Checkout failed: ${error.message}`);
      }
    } catch (error) {
      console.error("An error occurred during checkout:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchWithAuth("/food").then((res) => res.json()),
      fetchWithAuth("/food/combos").then((res) => res.json()),
    ])
      .then(([foodResponse, comboResponse]) => {
        const foodData = foodResponse.data || foodResponse;
        const comboData = comboResponse.data || comboResponse;
        
        setFoods(foodData);

        const mapped = comboData.map((c) => ({
          id: c.id.toString(),
          name: c.comboName,
          image: c.photoUrl || "https://via.placeholder.com/150",
          price: parseFloat(c.comboPrice), // Ensure price is a number
          items: c.foods.map((f) => f.name),
        }));
        setCombos(mapped);
      })
      .catch((err) => console.error("Failed to fetch data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && !isCheckoutOpen) {
    return (
      <div className="min-h-screen bg-gradient-cinema flex items-center justify-center">
        <p className="text-white text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {isCheckoutOpen && (
        <CheckoutModal
          totalPrice={getTotalPrice()}
          onCheckout={handleCheckout}
          onCancel={() => setCheckoutOpen(false)}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Food & Beverage</h1>
            {getTotalItems() > 0 && (
              <Card className="bg-card/50 border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {getTotalItems()} item(s) in cart
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {/* Fixed price formatting and currency */}
                      {getTotalPrice().toFixed(2)} Ks
                    </div>
                  </div>
                  <Button className="bg-gradient-accent hover:shadow-glow ml-4" onClick={() => setCheckoutOpen(true)}>
                    Checkout
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Combos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div key={combo.id} className="relative">
                <FoodComboCard
                  combo={combo}
                  quantity={cart[`combo_${combo.id}`] || 0}
                  onQuantityChange={(id, qty) => handleQuantityChange(`combo_${id.toString()}`, qty)}
                />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Individual Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foods.map((food) => (
                <Card
                  key={`food_${food.id}`}
                  className="bg-card/50 border-border/50 p-4 hover:border-primary/50 transition-colors relative flex flex-col"
                >
                  <img
                    src={food.photoUrl || "https://via.placeholder.com/150"}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-white mb-2">{food.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {food.description || "No description"}
                    </p>
                    {food.allergens && (
                      <p className="text-xs text-red-400 mb-1">
                        ⚠ Allergens: {food.allergens}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <Badge className="bg-primary text-primary-foreground">
                      {/* Fixed price formatting and currency */}
                      {Number(food.price).toFixed(2)} Ks
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(`food_${food.id}`, (cart[`food_${food.id}`] || 0) - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-white min-w-[20px] text-center">{cart[`food_${food.id}`] || 0}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(`food_${food.id}`, (cart[`food_${food.id}`] || 0) + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {cart[`food_${food.id}`] > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[24px] h-6 rounded-full flex items-center justify-center">
                      {cart[`food_${food.id}`]}
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};