import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { Loader2 } from 'lucide-react';
import { updatePageStatus } from '@cms/data';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: { id: string; pageName: string; pageStatus?: string };
}

const statusOptions = [
  {
    value: 'Published',
    label: 'Published',
    color: 'blue',
    description: 'The page is live and visible to the public.',
  },
  {
    value: 'Archived',
    label: 'Archived',
    color: 'blue',
    description: 'The page is no longer active but stored for reference.',
  },
  {
    value: 'Draft',
    label: 'Draft',
    color: 'blue',
    description: 'The page is in progress and not visible to the public.',
  },
];

export function PageStatusChangeDialog({ open, onOpenChange, currentRow }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [initialStatus, setInitialStatus] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePageStatus,
    onSuccess: () => {
      console.log('Page status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Update error:', error);
    },
  });

  useEffect(() => {
    if (open && currentRow?.pageStatus) {
      setSelectedOption(currentRow.pageStatus);
      setInitialStatus(currentRow.pageStatus);
    }
  }, [open, currentRow]);

  const handleSave = () => {
    if (!selectedOption || !currentRow) return;

    mutation.mutate({
      pageId: parseInt(currentRow.id, 10),
      status: selectedOption as 'Draft' | 'Published' | 'Archived',
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleSave}
      disabled={selectedOption === '' || selectedOption === initialStatus || mutation.isPending}
      isLoading={mutation.isPending}
      confirmText={
        mutation.isPending ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Saving...</span>
          </span>
        ) : (
          'Save'
        )
      }
      cancelButtonClass="bg-gray-100 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-200 focus:outline-none transition-all"
      title={
        <div className="flex items-center text-gray-900 text-xl font-bold space-x-2">
          <IconAlertTriangle className="text-blue-500" size={40} />
          <span>Change Page Status for “{currentRow.pageName}”</span>
        </div>
      }
      desc={
        <div className="space-y-6 text-gray-700 ">
          {currentRow.pageStatus && (
            <p className="text-sm text-gray-500 ">
              Current status:{' '}
              <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs capitalize">
                {currentRow.pageStatus}
              </span>
            </p>
          )}

          <Label className="block text-sm text-gray-700 ">Status Options:</Label>

          <div className="space-y-3">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className={`flex items-start border rounded-lg p-4 space-x-4 cursor-pointer transition-all 
                  ${
                    selectedOption === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 `
                      : 'border-gray-200'
                  }`}
              >
                <input
                  type="radio"
                  id={option.value}
                  name="status"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={() => setSelectedOption(option.value)}
                  className="mt-1 accent-current"
                />
                <div>
                  <span className="text-md font-medium text-gray-900">{option.label}</span>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          <Alert
            variant="default"
            className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg"
          >
            <AlertTitle className="font-semibold">Info</AlertTitle>
            <AlertDescription>
              Please do not forget to save after changing the page status.
            </AlertDescription>
          </Alert>
        </div>
      }
    />
  );
}
