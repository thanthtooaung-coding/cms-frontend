import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@cms/ui/components/dialog';
import { Loader2 } from 'lucide-react';
import { lmsApiFetch } from '../../../utils/apiClient';
import { Badge } from '@cms/ui/components/badge';

interface CategoryDetail {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  tenant?: {
    id: number;
    name: string;
  };
}

interface CategoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number | null;
}

export function CategoryDetailModal({ open, onOpenChange, categoryId }: CategoryDetailModalProps) {
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId || !open) {
        setCategory(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await lmsApiFetch(`/categories/${categoryId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch category details');
        }

        const data = await response.json();
        setCategory(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load category details');
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId, open]);

  const handleClose = () => {
    onOpenChange(false);
    // Clear data after a delay to allow animation
    setTimeout(() => {
      setCategory(null);
      setError(null);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading category details...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && category && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Category ID</label>
              <div className="text-base font-medium">{category.id}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Name</label>
              <div className="text-base font-semibold">{category.name}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Description</label>
              <div className="text-base text-muted-foreground whitespace-pre-wrap">
                {category.description || <span className="italic text-muted-foreground">No description provided</span>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Created At</label>
              <div className="text-base">
                {category.createdAt ? (
                  new Date(category.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                ) : (
                  <span className="text-muted-foreground italic">Not available</span>
                )}
              </div>
            </div>

            {category.tenant && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Tenant</label>
                <Badge variant="secondary" className="text-sm">
                  {category.tenant.name}
                </Badge>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

