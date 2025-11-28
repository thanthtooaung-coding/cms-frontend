import { useCategory } from '../context/category-context';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryEditDialog } from './category-edit-dialog';

export function OwnerDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategory();
  
  const handleDialogClose = (dialogType: 'edit' | 'delete') => {
    setOpen(dialogType);
    setTimeout(() => {
      setCurrentRow(null);
    }, 500);
  };

  return (
    <>
      {currentRow && (
        <>
          <CategoryEditDialog
            key={`category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                handleDialogClose('edit');
              }
            }}
            currentRow={currentRow}
            onSuccess={() => {
              // Refresh the page to update the list
              window.location.reload();
            }}
          />

          <CategoryDeleteDialog
            key={`category-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                handleDialogClose('delete');
              } else {
                setOpen('delete');
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
