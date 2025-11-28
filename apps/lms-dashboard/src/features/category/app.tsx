import { useState, useEffect } from 'react';
import { Button } from '@cms/ui/components/button';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { OwnerDialogs } from './actions/category-dialog';
import columns from './components/column';
import { DataTable } from './components/data-table';
import { CategoryProvider } from './context/category-context';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import type { CategoryType } from './data/schema';
import { lmsApiFetch } from '../../utils/apiClient';

const CategoryApp = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await lmsApiFetch('/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      const formattedData = data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description,
          createdAt: new Date(cat.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      }))
      .sort((a: CategoryType, b: CategoryType) => parseInt(a.id) - parseInt(b.id)); // Sort by ID
      setCategories(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Expose refresh function to context or use a refresh trigger
  useEffect(() => {
    const handleRefresh = () => {
      fetchCategories();
    };
    
    // Listen for custom refresh event
    window.addEventListener('category-refresh', handleRefresh);
    return () => {
      window.removeEventListener('category-refresh', handleRefresh);
    };
  }, []);


  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading categories...</p>
        </div>
      );
  }

  if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
            <p>Error: {error}</p>
        </div>
      );
  }

  return (
    <CategoryProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Category Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Category</p>
            </div>
            <Link to='create'>
            <Button>
              <Plus/> Create
            </Button>
            </Link>
          </div>

          <div>
            <DataTable data={categories} columns={columns} />
          </div>
        </div>
      </Main>
      <OwnerDialogs />
    </CategoryProvider>
  );
};

export default CategoryApp;