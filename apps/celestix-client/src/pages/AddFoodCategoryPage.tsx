import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AddFoodCategoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Food Category Added",
      description: "New food category has been successfully added.",
    });
    navigate(-1);
  };

  const handleInputChange = (field: string, value: string) => {
    setCategoryData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <ArrowLeft 
            className="w-6 h-6 text-foreground mr-4 cursor-pointer" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl font-bold text-foreground">Add New Food Category</h1>
        </div>

        <Card className="p-6 bg-card/50 border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name *
              </label>
              <Input
                value={categoryData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                value={categoryData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter category description"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent text-background">
                Add Category
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};