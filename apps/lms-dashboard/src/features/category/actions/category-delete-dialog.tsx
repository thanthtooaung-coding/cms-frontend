import { useState } from 'react';
import type { CategoryDataType } from '../data/schema';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Input } from '@cms/ui/components/input';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: CategoryDataType;
}

export function CategoryDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (categoryID: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (value.trim() !== currentRow.name) {
        setError("The entered name does not match the category's name.");
        return;
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${categoryID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      onOpenChange(false);
      // You might want to refresh the category list here
    } catch (err: any) {
        setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      className="cursor-pointer"
      onOpenChange={onOpenChange}
      handleConfirm={() => handleDelete(currentRow.id)}
      disabled={value.trim() !== currentRow.name || isSubmitting}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete
          Category
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the category from the system. This cannot be undone.
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Label className="my-2">
            Category Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter category name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
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