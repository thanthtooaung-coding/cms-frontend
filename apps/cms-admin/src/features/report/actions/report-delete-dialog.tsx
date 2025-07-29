import { useState } from 'react';
//import type { ReportDataType } from '../data/schema';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Input } from '@cms/ui/components/input';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { useReport } from '../context/report-context'; // <-- import your context

interface Props {
  onDelete: (id: string) => Promise<void> | void; // pass delete logic from parent
}

export function ReportDeleteDialog({ onDelete }: Props) {
  const { open, setOpen, currentRow } = useReport();
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!currentRow) return;
    if (value.trim() !== currentRow.name) return;

    try {
      setIsSubmitting(true);
      await onDelete(currentRow.id); // external logic (mutation/local state update)
      setOpen(null); // close dialog
      setValue(''); // reset input
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open === 'delete'}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
          setValue('');
        }
      }}
      handleConfirm={handleDelete}
      disabled={!currentRow || value.trim() !== currentRow.name}
      confirmText={isSubmitting ? 'Deleting...' : 'Delete'}
      isLoading={isSubmitting}
      destructive
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} />
          Delete Report
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <strong>{currentRow?.name}</strong>? <br />
            This action cannot be undone.
          </p>

          <Label>
            Report Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type report name to confirm"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>This operation is permanent and cannot be reversed.</AlertDescription>
          </Alert>
        </div>
      }
    />
  );
}
