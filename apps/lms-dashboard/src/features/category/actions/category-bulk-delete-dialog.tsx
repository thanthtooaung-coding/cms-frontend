import { useState } from 'react';
import type { CategoryDataType } from '../data/schema';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { lmsApiFetch } from '../../../utils/apiClient';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategories: CategoryDataType[];
}

export function CategoryBulkDeleteDialog({ open, onOpenChange, selectedCategories }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const ids = selectedCategories.map(cat => parseInt(cat.id));
      const response = await lmsApiFetch('/categories/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to delete categories';
        throw new Error(errorMessage);
      }

      onOpenChange(false);
      // Trigger refresh event
      window.dispatchEvent(new Event('category-refresh'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryNames = selectedCategories.map(cat => cat.name).join(', ');

  return (
    <ConfirmDialog
      open={open}
      className="cursor-pointer"
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isSubmitting}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete
          Selected Categories
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{selectedCategories.length}</span> selected
            categor{selectedCategories.length === 1 ? 'y' : 'ies'}?
            <br />
            This action will permanently remove {selectedCategories.length === 1 ? 'this category' : 'these categories'} from the system. This cannot be undone.
          </p>

          {selectedCategories.length <= 3 && (
            <div className="text-sm text-muted-foreground">
              <strong>Categories:</strong> {categoryNames}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Categories with associated courses cannot be deleted. Please remove or reassign all courses from these categories before deleting them, or use force delete instead.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isSubmitting ? 'Deleting...' : 'Delete'}
      isLoading={isSubmitting}
      destructive
    />
  );
}

