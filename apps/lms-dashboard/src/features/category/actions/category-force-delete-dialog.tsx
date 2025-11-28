import { useState } from 'react';
import type { CategoryDataType } from '../data/schema';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { lmsApiFetch } from '../../../utils/apiClient';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategories: CategoryDataType[];
}

export function CategoryForceDeleteDialog({ open, onOpenChange, selectedCategories }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const handleForceDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (confirmText.trim().toLowerCase() !== 'delete all') {
        setError("Please type 'DELETE ALL' to confirm force deletion");
        return;
      }

      const ids = selectedCategories.map(cat => parseInt(cat.id));
      const response = await lmsApiFetch('/categories/bulk/force', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to force delete categories';
        throw new Error(errorMessage);
      }

      onOpenChange(false);
      setConfirmText('');
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
      onOpenChange={(open) => {
        if (!open) {
          setConfirmText('');
          setError(null);
        }
        onOpenChange(open);
      }}
      handleConfirm={handleForceDelete}
      disabled={confirmText.trim().toLowerCase() !== 'delete all' || isSubmitting}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Force Delete
          Selected Categories
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <strong className="text-destructive">WARNING: This is a destructive operation!</strong>
            <br />
            <br />
            Are you sure you want to force delete <span className="font-bold">{selectedCategories.length}</span> selected
            categor{selectedCategories.length === 1 ? 'y' : 'ies'}?
            <br />
            <br />
            This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The selected categor{selectedCategories.length === 1 ? 'y' : 'ies'}</li>
              <li>All associated courses</li>
              <li>All modules within those courses</li>
              <li>All lessons within those modules</li>
              <li>All quizzes within those modules</li>
            </ul>
            <br />
            <strong className="text-destructive">This action cannot be undone!</strong>
          </p>

          {selectedCategories.length <= 3 && (
            <div className="text-sm text-muted-foreground">
              <strong>Categories:</strong> {categoryNames}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground">
              Type <span className="font-mono text-destructive">DELETE ALL</span> to confirm:
            </Label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ALL"
              className="w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Alert variant="destructive">
            <AlertTitle>Critical Warning!</AlertTitle>
            <AlertDescription>
              This operation will permanently delete all selected categories and all their associated courses, modules, lessons, and quizzes. 
              This cannot be rolled back. Please ensure you have backups if needed.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isSubmitting ? 'Force Deleting...' : 'Force Delete'}
      isLoading={isSubmitting}
      destructive
    />
  );
}

