import { useInstructor } from '../context/instructor-context';

import { InstructorDeleteDialog } from './instructor-delete-dialog';

export function InstructorDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInstructor();
  return (
    <>
      {/* <InstructorActionDialog
        key="instructor-add"
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

          <InstructorDeleteDialog
            key={`instructor-delete-${currentRow.id}`}
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
