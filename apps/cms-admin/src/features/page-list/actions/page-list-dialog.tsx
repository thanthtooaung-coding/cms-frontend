import { usePage } from '../context/page-list-context';

import { PageStatusChangeDialog } from './page-status-change-dialog';

export function PageListDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePage();
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

          <PageStatusChangeDialog
            key={`page-status-change-${currentRow.id}`}
            open={open === 'status-select'}
            onOpenChange={() => {
              setOpen('status-select');
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
