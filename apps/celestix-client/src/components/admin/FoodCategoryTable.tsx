import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialCategories = [
  { id: 1, name: "Snacks", description: "Classic movie theater snacks like popcorn and nachos." },
  { id: 2, name: "Drinks", description: "Sodas, juices, and other beverages." },
  { id: 3, name: "Food", description: "Hot food items like hot dogs and pizza." },
  { id: 4, name: "Desserts", description: "Sweet treats like ice cream and candy." },
  { id: 5, name: "Combos", description: "Value deals combining multiple items." }
];

export const FoodCategoryTable = () => {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(initialCategories);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Food Categories</h1>
        <Button
            className="bg-gradient-accent hover:shadow-glow"
            onClick={() => navigate("/admin/food-categories/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <Card className="glass-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </Card>

      <Card className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Category Name</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Description</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{category.name}</td>
                  <td className="p-4 text-muted-foreground">{category.description}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};