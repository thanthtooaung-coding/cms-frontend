import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { CourseSchema } from '../data/schema';
import { useCourse } from '../context/course-context';
import { Button } from '@cms/ui/components/button';
import { IconTrash } from '@tabler/icons-react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const course = CourseSchema.parse(row.original);
  const navigate = useNavigate();
  const { setOpen, setCurrentRow } = useCourse();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* <DropdownMenuItem
          onClick={() => {
            setCurrentRow(course);
            navigate(`/enrollments/courses/${course.id}`);
          }}
        >
          View Enrollment
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setCurrentRow(course);
            setOpen('change-status');
          }}
        >
          Change Status
        </DropdownMenuItem>
        <DropdownMenuSeparator/>

        {/* <DropdownMenuItem
          className="cursor-pointer"
          // onClick={() => {
          //   setCurrentRow(page);
          //   setOpen('status-select');
          // }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator/> */}

        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => {
            setCurrentRow(course);
            setOpen('delete');
          }}
        >
          Delete
          <DropdownMenuShortcut className="cursor-pointer">
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
