import { useReport } from '../context/report-context';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';

export function OwnerDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useReport();

  return (
    <>
      {/* <OwnerActionDialog
        key="owner-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      /> */}

      {currentRow && (
        <>
          {/* <BrandActionDialog
            key={`brand-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          /> */}

          <ConfirmDialog
            key={`owner-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentRow(null);
                }, 300);
              }
            }}
            handleConfirm={() => {
              console.log('Deleting report:', currentRow.id);
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 300);
            }}
            confirmText="OK"
            // cancelText="Cancel"
            title="Delete Report"
            desc={
              <p>
                Are you sure you want to delete <strong>{currentRow.name}</strong>?<br />
                This action cannot be undone.
              </p>
            }
            destructive
          />
        </>
      )}
    </>
  );
}
