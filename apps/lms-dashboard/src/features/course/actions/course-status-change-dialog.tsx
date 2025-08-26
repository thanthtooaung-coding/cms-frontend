import { useState, useEffect } from 'react';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Label } from '@cms/ui/components/label';
import { Alert, AlertDescription, AlertTitle } from '@cms/ui/components/alert';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: { id: string; title: string; status?: string };
}

const statusOptions = [
  { value: 'Published', label: 'Published' },
  { value: 'Unpublished', label: 'Unpublished' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Pending', label: 'Pending' },
];

const statusColorMap: Record<string, { bg: string; border: string; text: string }> = {
    published: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900' },
    unpublished: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-900' },
    archived: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800' },
    pending: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-900' },
};


export function CourseStatusChangeDialog({ open, onOpenChange, currentRow }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialStatus, setInitialStatus] = useState<string>('');

  useEffect(() => {
    if (open && currentRow?.status) {
      const currentStatus = currentRow.status.charAt(0).toUpperCase() + currentRow.status.slice(1);
      setSelectedOption(currentStatus);
      setInitialStatus(currentStatus);
    }
  }, [open, currentRow]);

  const handleSave = async (id: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (!selectedOption) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedOption }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course status');
      }

      onOpenChange(false);
      // You might want to refresh the course list here
    } catch (err: any) {
        setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => handleSave(currentRow.id)}
      disabled={selectedOption === '' || selectedOption === initialStatus || isSubmitting}
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
      cancelButtonClass="bg-gray-100 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-200 focus:outline-none transition-all"
      contentClassName="max-h-[70vh] overflow-y-auto"
      title={
        <div className="flex items-center text-gray-900 text-xl font-bold space-x-2">
          <IconAlertTriangle className="text-blue-500" size={40} />
          <span>Change Page Status for “{currentRow.title}”</span>
        </div>
      }
      desc={
        <div className="space-y-4 text-gray-700">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {currentRow.status && (
            <div className="text-sm text-gray-500">
              Current status:{' '}
              <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs capitalize">
                {currentRow.status}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label className="block text-sm text-gray-700">Status Options:</Label>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const statusKey = option.value.toLowerCase();
                const { bg, border, text } = statusColorMap[statusKey];
                const isSelected = selectedOption === option.value;

                return (
                  <label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-start border rounded-md p-4 space-x-4 cursor-pointer transition-all 
                      ${isSelected ? `${bg} ${border}` : 'bg-white border-gray-200'}
                      hover:border-gray-400`}
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="status"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setSelectedOption(option.value)}
                      className="mt-1 accent-gray-800"
                    />
                    <div>
                      <span className={`text-sm font-medium ${isSelected ? text : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <Alert
            variant="default"
            className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg"
          >
            <AlertTitle className="font-semibold">Info</AlertTitle>
            <AlertDescription>
              Please do not forget to save after changing Course status.
            </AlertDescription>
          </Alert>
        </div>
      }
    />
  );
}