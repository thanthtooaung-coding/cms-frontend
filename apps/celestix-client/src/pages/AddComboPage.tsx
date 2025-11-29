import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchWithAuth } from "@/lib/api";

export const AddComboPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = useState(0);
  const [comboImage, setComboImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    availability: "Available",
  });

  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<{ [key: number]: number }>(
    {}
  );

  useEffect(() => {
    fetchWithAuth("/food")
      .then((res) => res.json())
      .then((result) => {
        const data = result.data || result;
        setAllFoods(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const getTotalItems = () =>
    Object.values(selectedFoods).reduce((sum, qty) => sum + qty, 0);

  const handleInputChange = (field: string, value: string) => {
    setFoodData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setComboImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleQuantityChange = (foodId: number, delta: number) => {
    const currentQty = selectedFoods[foodId] || 0;
    const total = getTotalItems();
    const newQty = currentQty + delta;
    const newTotal = total + delta;

    if (newQty < 0) return;
    if (newTotal > 5) {
      toast({ title: "A combo cannot exceed 5 food items." });
      return;
    }

    const updatedSelected: { [key: number]: number } = { ...selectedFoods };
    if (newQty > 0) {
      updatedSelected[foodId] = newQty;
    } else {
      delete updatedSelected[foodId];
    }

    const sum = Object.entries(updatedSelected).reduce((acc, [id, qty]) => {
      const food = allFoods.find((f) => f.id === Number(id));
      return acc + (food ? food.price * (qty as number) : 0);
    }, 0);

    let discountRate = 0;
    switch (newTotal) {
      case 2:
        discountRate = 0.03;
        break;
      case 3:
        discountRate = 0.05;
        break;
      case 4:
        discountRate = 0.08;
        break;
      case 5:
        discountRate = 0.1;
        break;
      default:
        discountRate = 0;
    }

    setSelectedFoods(updatedSelected);
    setTotalPrice(sum * (1 - discountRate));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodData.name) {
      toast({ title: "Enter combo name" });
      return;
    }

    const totalItems = getTotalItems();
    const foodIds = Object.entries(selectedFoods).flatMap(([id, qty]) =>
      Array(qty).fill(Number(id))
    );

    if (totalItems < 2) {
      toast({ title: "A combo must have at least 2 food items." });
      return;
    }
    if (totalItems > 5) {
      toast({ title: "A combo cannot exceed 5 food items." });
      return;
    }

    let imageUrl = "";
    if (comboImage) {
      const formData = new FormData();
      formData.append("file", comboImage);
      try {
        const response = await fetchWithAuth("/media", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          imageUrl = result.data.url;
        } else {
          toast({
            title: "Error",
            description: "Image upload failed.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred during image upload.",
          variant: "destructive",
        });
        return;
      }
    }

    fetchWithAuth("/food/combos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comboName: foodData.name,
        foodIds: foodIds,
        photoUrl: imageUrl,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          toast({
            title: "Food Combo Added",
            description: "New food combo has been successfully added.",
          });
          navigate(-1);
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to add combo.",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Error", description: "Failed to add combo." });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ArrowLeft
            className="w-6 h-6 text-foreground mr-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl font-bold text-foreground">
            Add New Food Combo
          </h1>
        </div>

        <Card className="p-6 bg-card/50 border-border/50 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Select Food Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {allFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>
                  {food.name} - {food.price} Ks
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={(selectedFoods[food.id] || 0) === 0}
                    onClick={() => handleQuantityChange(food.id, -1)}
                  >
                    −
                  </Button>
                  <span>{selectedFoods[food.id] || 0}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={getTotalItems() >= 5}
                    onClick={() => handleQuantityChange(food.id, +1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Food Combo Name *
                </Label>
                <Input
                  value={foodData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter combo name"
                  required
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Total Price (Ks)
                </Label>
                <Input
                  value={totalPrice + " Ks"}
                  readOnly
                  placeholder="Select foods to see total price"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-foreground">Food Image</Label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-border transition-colors">
                <Input type="file" onChange={handleFileChange} className="hidden" id="combo-image-upload" />
                <Label htmlFor="combo-image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drop your image here, or browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports: JPG, PNG (Max 5MB)
                  </p>
                </Label>
                {previewImage && <img src={previewImage} alt="Combo preview" className="mt-4 mx-auto h-32" />}
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-accent text-background"
              >
                Add Food Combo
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
