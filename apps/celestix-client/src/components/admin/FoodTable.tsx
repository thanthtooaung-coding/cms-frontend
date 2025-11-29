import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { FilterPopover } from "@/components/FilterPopover";
import { fetchWithAuth } from "@/lib/api";

export const FoodTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ category: [] });
  const [foodItems, setFoodItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  // ---------------- Fetch Combos ----------------
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetchWithAuth("/food/combos");
        const result = await response.json();
        const data = result.data || result;
        setCombos(data);
      } catch (error) {
        console.error("Failed to fetch combos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const filteredCombos = combos.filter((combo) =>
    combo.comboName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCombo = async (id) => {
    if (window.confirm("Are you sure you want to delete this combo?")) {
      try {
        await fetchWithAuth(`/food/combos/${id}`, {
          method: "DELETE",
        });
        setCombos(combos.filter((combo) => combo.id !== id));
      } catch (error) {
        console.error("Failed to delete the combo:", error);
      }
    }
  };

  // ---------------- Fetch Foods ----------------
  const loadFoods = async () => {
    await fetchWithAuth("/food")
      .then((res) => res.json())
      .then((result) => {
        const data = result.data || result;
        setFoodItems(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const filteredFood = foodItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) =>
        filters.category.length === 0 ||
        filters.category.includes(item.category)
    );

  const totalPages = Math.ceil(filteredFood.length / itemsPerPage);

  const filterSections = [
    {
      title: "By Category",
      stateKey: "category",
      options: ["Snacks", "Drinks", "Food"],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading combos...</p>
      </div>
    );
  }

  const formatFoods = (foods: { name: string }[]) => {
  const counts: Record<string, number> = {};

  foods.forEach((food) => {
    counts[food.name] = (counts[food.name] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => `${count}x ${name}`)
    .join(" , ");
};


  return (
    <div className="space-y-6">
      {/* ---------------- Food Items Section ---------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Food & Beverages</h1>
        <Button
          className="bg-gradient-accent hover:shadow-glow transition-all duration-300"
          onClick={() => navigate("/admin/food/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Food Item
        </Button>
      </div>

      {/* Search + Filter */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search Food Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <FilterPopover
            filterSections={filterSections}
            selectedFilters={filters}
            onFilterChange={(updatedFilters) =>
              setFilters((prev) => ({ ...prev, ...updatedFilters }))
            }
          />
        </div>
      </Card>

      {/* Food Table */}
      <Card className="glass-card">
        <div className="overflow-x-auto">
          <div className="max-h-[25rem] overflow-y-auto scroll-smooth">
            <table className="w-full">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 pl-9 text-muted-foreground font-medium">
                    Name ↕
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Price
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Category
                  </th>
                  <th className="text-left p-4 pr-10 text-muted-foreground font-medium">
                    Description
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFood.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-4xl">
                          🍔
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-foreground">
                            No Food Items Found
                          </p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            {searchTerm || filters.category.length > 0
                              ? "No food items match your search or filters. Try adjusting your search terms or filters."
                              : "You haven't added any food items yet. Start building your menu by adding delicious food and beverages!"}
                          </p>
                          {!searchTerm && filters.category.length === 0 && (
                            <Button
                              className="mt-4 bg-gradient-accent hover:shadow-glow transition-all duration-300"
                              onClick={() => navigate("/admin/food/add")}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Your First Food Item
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFood.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 pl-9 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>🍽</span>
                          )}
                        </div>
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                      </td>
                      <td className="p-4 text-foreground font-medium">
                        {item.price} Ks
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="p-4 text-muted-foreground pr-10">
                        {item.description}
                      </td>
                      <td className="p-4 flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => navigate(`/admin/food/edit/${item.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            fetchWithAuth(`/food/${item.id}`, {
                              method: "DELETE",
                            })
                              .then(async (res) => {
                                if (res.ok) {
                                  loadFoods();
                                } else if (res.status === 409) {
                                  const text = await res.text();
                                  alert(text);
                                } else {
                                  alert(
                                    "This item is included in a food combo. Please delete the combo first."
                                  );
                                }
                              })
                              .catch(() => {
                                alert("Network error. Please try again.");
                              });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* ---------------- Combos Section ---------------- */}
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold text-foreground">Food Combos</h1>
        <Button
          className="bg-gradient-accent hover:shadow-glow transition-all duration-300"
          onClick={() => navigate("/admin/combo")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Food Combo
        </Button>
      </div>

      <Card className="glass-card p-4 my-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search Food Combos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </Card>

      {/* Combo Table */}
      <Card className="glass-card">
        <div className="overflow-x-auto max-h-[25rem] overflow-y-auto scroll-smooth">
          <table className="w-full ">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b border-border/50">
                <th className="text-left p-4 pl-9 text-muted-foreground font-medium">
                  Name ↕
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  Included Items
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-left p-4 text-muted-foreground font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCombos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-foreground">
                          No Food Combos Found
                        </p>
                        <p className="text-sm text-muted-foreground max-w-md">
                          {searchTerm 
                            ? "No combos match your search. Try adjusting your search terms."
                            : "You haven't created any food combos yet. Create special combo deals to offer customers great value!"}
                        </p>
                        {!searchTerm && (
                          <Button
                            className="mt-4 bg-gradient-accent hover:shadow-glow transition-all duration-300"
                            onClick={() => navigate("/admin/combo")}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Combo
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCombos.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4 pl-9 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>🍽</span>
                        )}
                      </div>

                      <span className="font-medium">{item.comboName}</span>
                    </td>
                    <td className="p-4">
                      {item.foods ? formatFoods(item.foods) : ""}
                    </td>

                    <td className="p-4 font-medium">{item.comboPrice} Ks</td>
                    <td className="p-4 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/combo/edit/${item.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCombo(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
