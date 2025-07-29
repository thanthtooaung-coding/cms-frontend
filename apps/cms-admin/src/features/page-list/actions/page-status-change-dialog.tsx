import { useState, useEffect } from 'react';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: { id: string; pageName: string; pageStatus?: string };
}

const statusOptions = [
  {
    value: 'published',
    label: 'Published',
    color: 'blue',
    description: 'The page is live and visible to the public.',
  },
  {
    value: 'archived',
    label: 'Archived',
    color: 'blue',
    description: 'The page is no longer active but stored for reference.',
  },
  {
    value: 'draft',
    label: 'Draft',
    color: 'blue',
    description: 'The page is in progress and not visible to the public.',
  },
];

export function PageStatusChangeDialog({ open, onOpenChange, currentRow }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialStatus, setInitialStatus] = useState<string>("");


  useEffect(() => {
    if (open && currentRow?.pageStatus) {
      setSelectedOption(currentRow.pageStatus.toLowerCase());
      setInitialStatus(currentRow.pageStatus.toLowerCase());
    }
  }, [open, currentRow]);

  const handleSave = async (id: string) => {
    try {
      setIsSubmitting(true);
      if (!selectedOption) return;

      console.log('Saving status change:', selectedOption, 'for page ID:', id);

      onOpenChange(false); 
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => handleSave(currentRow.id)}
      disabled={selectedOption === '' || selectedOption === initialStatus}
      isLoading={isSubmitting}
      confirmText={
        isSubmitting ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Saving...</span>
          </span>
        ) : (
          'Save'
        )
      }
      //className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl mx-auto border border-gray-200"
      //confirmButtonClass="bg-blue-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-60"
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
                  <span className="text-md font-medium text-gray-900">
                    {option.label}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
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

