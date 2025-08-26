import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { Button } from '@cms/ui/components/button';
import { EnrollmentSchema } from '../data/schema';
import { useEnrollment } from '../context/enrollment-context';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const enrollment = EnrollmentSchema.parse(row.original);

  const { setOpen, setCurrentRow } = useEnrollment();

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(enrollment);
            setOpen('edit');
          }}
        >
          View Student 
          <DropdownMenuShortcut className="cursor-pointer">
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(enrollment);
            setOpen('edit');
          }}
        >
          View Course 
          <DropdownMenuShortcut className="cursor-pointer">
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(enrollment);
            setOpen('edit');
          }}
        >
          Edit
          <DropdownMenuShortcut className="cursor-pointer">
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => {
            setCurrentRow(enrollment);
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
