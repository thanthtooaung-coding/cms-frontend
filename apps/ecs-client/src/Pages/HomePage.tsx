import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { ecsApiFetch } from '../utils/apiClient';
import { useTenant } from '../context/TenantContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function HomePage() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const basePath = tenantSlug ? `/ecs-client/${tenantSlug}` : '/ecs-client';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!tenantId) return;
      try {
        const response = await ecsApiFetch(`/products?tenantId=${tenantId}`);
        if (response.ok) {
          const result = await response.json();
          setProducts(result.data?.slice(0, 8) || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [tenantId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-gray-600">Discover amazing products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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

      <div className="mt-8 text-center">
        <Link to={`${basePath}/products`}>
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    </div>
  );
}
