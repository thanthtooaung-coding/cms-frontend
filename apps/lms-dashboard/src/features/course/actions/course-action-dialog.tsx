import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@cms/ui/components/dialog';
import { Button } from '@cms/ui/components/button';
import CreateCourse from '../form/CreateCourse';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
//   currentRow?: CreateCourseData; // Optional: for editing existing data
}

export default function CourseActionDialog({ open, onOpenChange, 
    // currentRow 
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{
        //   currentRow ? 'Edit Course' : 
          'Create Course'}</DialogTitle>
        </DialogHeader>

        {/* Your form goes here */}
        {/* <CreateCourseForm currentRow={currentRow} onClose={() => onOpenChange(false)} /> */}


        <CreateCourse/>
      </DialogContent>
    </Dialog>
  );
}
