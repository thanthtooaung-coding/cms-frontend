import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { lmsApiFetch } from '../utils/apiClient';

interface Category {
  id: number;
  name: string;
}

export default function SubNavigation() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await lmsApiFetch('/categories', {}, true);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';

  return (
    <div className="bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 lg:space-x-8 py-3 overflow-x-auto scrollbar-hide">
          <Link
            to={basePath || '/'}
            className="text-xs lg:text-sm text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors font-medium"
          >
            Home
          </Link>
          {loading ? (
            <span className="text-xs lg:text-sm text-gray-400">Loading categories...</span>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`${basePath}/courses?category=${encodeURIComponent(category.name)}`}
                className="text-xs lg:text-sm text-gray-600 hover:text-purple-600 whitespace-nowrap transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
