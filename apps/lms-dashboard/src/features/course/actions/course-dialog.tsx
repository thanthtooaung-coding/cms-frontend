import { useCourse } from '../context/course-context';
import { CourseDeleteDialog } from './course-delete-dialog';
import { CourseStatusChangeDialog } from './course-status-change-dialog';
import CourseActionDialog from './course-action-dialog';

export function CourseDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCourse(); 
  console.log(open);
  return (
    <>
      <CourseActionDialog
        key="course-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {/* <CategoryActionDialog
        key="category-add"
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

          <CourseStatusChangeDialog
            key={`course-status-change-${currentRow.id}`}
            open={open === 'change-status'}
            onOpenChange={() => {
              setOpen('change-status');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />p

          <CourseDeleteDialog
            key={`course-delete-${currentRow.id}`}
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
