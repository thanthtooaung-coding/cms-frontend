import { IconPlus } from '@tabler/icons-react';
import { Button } from '@cms/ui/components/button';
import { useCourse } from '../context/course-context';

export function AddCourse() {
  const { setOpen } = useCourse();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1 cursor-pointer" 
        onClick={() => setOpen('add')}>
        <span>Add New</span> <IconPlus size={18} />
      </Button>
    </div>
  );
}
