import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { 
  IconTrash, 
  IconCheck, 
  IconX, 
  IconPencil } from '@tabler/icons-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { PageRequestSchema } from '../data/schema';
import { usePageRequest } from '../context/page-request-context';
import { Button } from '@cms/ui/components/button';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const pageRequest = PageRequestSchema.parse(row.original);

  const { setOpen, setCurrentRow } = usePageRequest();

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
            setCurrentRow(pageRequest);
            // setOpen('edit');
          }}
        >
          Approve
          <DropdownMenuShortcut className="cursor-pointer">
            <IconCheck size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(pageRequest);
            // setOpen('edit');
          }}
        >
          Reject
          <DropdownMenuShortcut className="cursor-pointer">
            <IconX size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(pageRequest);
            setOpen('edit');
          }}
        >
          Edit
          <DropdownMenuShortcut className="cursor-pointer">
            <IconPencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => {
            setCurrentRow(pageRequest);
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
