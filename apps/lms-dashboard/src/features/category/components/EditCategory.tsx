import { Button } from '@cms/ui/components/button';
import { Textarea } from '@cms/ui/components/textarea';
import { Input } from '@cms/ui/components/input';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTenantNavigate, useTenantUrl } from '../../../hooks/useTenantNavigate';
import { useParams } from 'react-router-dom';
import { lmsApiFetch } from '../../../utils/apiClient';
import { Header } from '../../../components/Layout/Header';
import { Main } from '../../../components/Layout/main';
import { ProfileDropdown } from '../../../components/profile-dropdown';
import { Search } from '../../../components/search';

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useTenantNavigate();
  const getTenantUrl = useTenantUrl();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await lmsApiFetch(`/categories/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        const data = await response.json();
        setName(data.name || '');
        setDescription(data.description || '');
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const tenantId = localStorage.getItem('tenant_id');
      if (!tenantId) {
        setError('Tenant information not available');
        setIsSubmitting(false);
        return;
      }

      const updateData = {
        name,
        description,
        tenantId: parseInt(tenantId),
      };

      const response = await lmsApiFetch(`/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update category');
      }

      navigate('/category');
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Loading category...</p>
            </div>
          </div>
        </Main>
      </>
    );
  }

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="py-3">
          <div className="mb-4">
            <Button onClick={() => navigate('/category')} variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-8 p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Category</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
                placeholder="Enter category name..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full"
                placeholder="Enter description..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/category')}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !name.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Category'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Main>
    </>
  );
};

export default EditCategory;



