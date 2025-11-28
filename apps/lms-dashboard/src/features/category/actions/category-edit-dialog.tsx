import { useState, useEffect } from 'react';
import type { CategoryDataType } from '../data/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@cms/ui/components/dialog';
import { Label } from '@cms/ui/components/label';
import { Input } from '@cms/ui/components/input';
import { Textarea } from '@cms/ui/components/textarea';
import { Button } from '@cms/ui/components/button';
import { Loader2 } from 'lucide-react';
import { lmsApiFetch } from '../../../utils/apiClient';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: CategoryDataType;
  onSuccess?: () => void;
}

export function CategoryEditDialog({ open, onOpenChange, currentRow, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentRow) {
      setName(currentRow.name || '');
      setDescription(currentRow.description || '');
      setError(null);
    }
  }, [open, currentRow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const response = await lmsApiFetch(`/categories/${currentRow.id}`, {
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

      onOpenChange(false);
      // Trigger refresh event
      window.dispatchEvent(new Event('category-refresh'));
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter category name..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description</Label>
              <Textarea
                id="edit-category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

