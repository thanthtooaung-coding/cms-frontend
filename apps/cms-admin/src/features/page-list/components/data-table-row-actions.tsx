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
import { PageListSchema } from '../data/schema';
import { usePage } from '../context/page-list-context';
import { Button } from '@cms/ui/components/button';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const page = PageListSchema.parse(row.original);
  const navigate = useNavigate();
  const { setOpen, setCurrentRow } = usePage();

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
            setCurrentRow(page);
            navigate(page.pageUrl);
          }}
        >
          Visit Page
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setCurrentRow(page);
            setOpen('status-select');
          }}
        >
          Change status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
