import { usePageRequest } from '../context/page-request-context';

import { PageRequestDeleteDialog } from './page-request-delete-dialog';

export function PageRequestDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePageRequest();
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

          <PageRequestDeleteDialog
            key={`page-request-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
