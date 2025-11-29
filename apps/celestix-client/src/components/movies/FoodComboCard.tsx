import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface FoodComboCardProps {
  combo: {
    id: string;
    name: string;
    image: string;
    price: number;
    items: string[];
  };
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
}

export const FoodComboCard = ({
  combo,
  quantity,
  onQuantityChange,
}: FoodComboCardProps) => {
  const formatItems = (items: string[]) => {
    const grouped: { [key: string]: number } = {};
    items.forEach((item) => {
      grouped[item] = (grouped[item] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, qty]) => `${qty}x ${name}`)
      .join(" + ");
  };

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-200">
      {/* Food Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={combo.image}
          alt={combo.name}
          className="w-full h-full object-cover"
        />

        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded font-bold">
          {combo.price} Ks
        </div>
      </div>

      {/* Combo Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-foreground">{combo.name}</h3>

        <div className="text-sm text-muted-foreground">
          {formatItems(combo.items)}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onQuantityChange(combo.id, Math.max(0, quantity - 1))
            }
            className="w-8 h-8"
            disabled={quantity <= 0}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="font-bold text-lg w-8 text-center">{quantity}</span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(combo.id, quantity + 1)}
            className="w-8 h-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
