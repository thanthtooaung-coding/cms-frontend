import { useState } from 'react';
import type { PageRequestType } from '../data/schema';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Input } from '@cms/ui/components/input';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: PageRequestType;
}

export function PageRequestDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   const deleteMutation = useMutation({
  //     mutationFn: deleteBrand,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: [''] });
  //       toast.success('Brand deleted successfully');
  //       onOpenChange(false);
  //     },
  //     onError: (error) => {
  //       toast.error('Failed to delete brand');
  //       console.error('Delete error:', error);
  //     },
  //   });

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);

      if (value.trim() !== currentRow.pageName) return;

      console.log(id);
      //   await deleteMutation.mutateAsync(brandId);
    } catch (error) {
      console.error('Delete error:', error);
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
      disabled={value.trim() !== currentRow.pageName}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete
          Page Request
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentRow.pageName}</span>
            ?
            <br />
            This action will permanently remove the page request from the system. This cannot be
            undone.
          </p>

          <Label className="my-2">
            Page Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Page Name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
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
