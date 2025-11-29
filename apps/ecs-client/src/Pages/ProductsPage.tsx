import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Package, Search } from 'lucide-react';
import { ecsApiFetch } from '../utils/apiClient';
import { useTenant } from '../context/TenantContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tenantId } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId) return;
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          ecsApiFetch(`/products?tenantId=${tenantId}`),
          ecsApiFetch(`/categories?tenantId=${tenantId}`)
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.data || []);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenantId]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryName === 
      categories.find(c => c.id === selectedCategory)?.name;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchParams({ search: e.target.value });
          }}
          className="flex-1"
        />
      </div>

      <div className="flex gap-6">
        <div className="w-64">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left p-2 rounded ${!selectedCategory ? 'bg-blue-100' : ''}`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-2 rounded ${selectedCategory === category.id ? 'bg-blue-100' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Search className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
              <p className="text-slate-500 text-center max-w-md">
                {searchQuery 
                  ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or browse all categories.`
                  : 'No products are available at the moment. Please check back later.'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="w-full h-48 bg-slate-50 flex items-center justify-center p-4">
                    <img 
                      src={product.imageUrl || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold mb-4">${product.price}</p>
                    <Link to={`${basePath}/product/${product.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

