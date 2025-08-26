import { useEnrollment } from "../context/enrollment-context";
import { EnrollmentDeleteDialog } from "./enrollment-delete-dialog";


export function OwnerDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEnrollment();
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

          <EnrollmentDeleteDialog
            key={`enrollment-delete-${currentRow.id}`}
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
