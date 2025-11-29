import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/api";

export const EditFoodPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [foodData, setFood] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    allergens: "",
    available: "",
    photoUrl: ""
  });
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(`/food`)
      .then((res) => res.json())
      .then((result) => {
        const data = result.data || result;
        const found = data.find((f: any) => f.id === Number(id));
        if (found) {
          setFood(found);
          if (found.photoUrl) {
            setPreviewImage(found.photoUrl);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFood(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoodImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = parseFloat(foodData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be a number greater than zero.",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = foodData.photoUrl;
    if (foodImage) {
      const formData = new FormData();
      formData.append("file", foodImage);

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

    await fetchWithAuth(`/food/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...foodData,
        photoUrl: imageUrl
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          toast({
            title: "Food Item Updated",
            description: "Food item has been successfully updated.",
          });
          navigate("/admin/food");
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update food item.",
            variant: "destructive",
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Edit Food Item</h1>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Food Item Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    value={foodData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-secondary/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-foreground">Price ($)</Label>
                  <Input
                    id="price"
                    value={foodData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="bg-secondary/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <Select value={foodData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Drinks">Drinks</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={foodData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className="bg-secondary/50 border-border/50 text-foreground resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergens" className="text-foreground">Allergens</Label>
                  <Input
                    id="allergens"
                    value={foodData.allergens}
                    onChange={(e) => handleInputChange("allergens", e.target.value)}
                    placeholder="Contains dairy, nuts, etc."
                    className="bg-secondary/50 border-border/50 text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-foreground">Food Image</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-border transition-colors">
                  <Input type="file" onChange={handleFileChange} className="hidden" id="food-image-upload" />
                  <Label htmlFor="food-image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drop your image here, or browse</p>
                    <p className="text-sm text-muted-foreground">Supports: JPG, PNG (Max 5MB)</p>
                  </Label>
                  {previewImage && <img src={previewImage} alt="Food preview" className="mt-4 mx-auto h-32" />}
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-border/50 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-accent text-background hover:opacity-90"
                >
                  Update Food Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};