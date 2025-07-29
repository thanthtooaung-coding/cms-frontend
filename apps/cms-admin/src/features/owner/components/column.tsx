import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@cms/ui/components/badge';

import { cn } from '@cms/ui/lib/utils';

import { DataTableColumnHeader } from '@cms/ui/components/data-table-column-header';
import type { OwnerType } from '../data/schema';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@cms/ui/components/checkbox';

export const columns: ColumnDef<OwnerType>[] = [
  {
    accessorKey: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base leading-tight max-w-48">
            {row.original.username}
          </span>
        </div>
      </div>
    ),
    size: 300,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.email}</span>
        </div>
      </div>
    ),
    size: 300,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },
  {
    accessorKey: 'Requests',
    header: ({ column }) => <DataTableColumnHeader column={column} title="requests" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.numberOfRequestPages}</span>
        </div>
      </div>
    ),
    size: 300,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },
  {
    accessorKey: 'Pages',
    header: ({ column }) => <DataTableColumnHeader column={column} title="page" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.numberOfPagesOwned}</span>
        </div>
      </div>
    ),
    size: 300,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },

  {
    accessorKey: 'verified',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isActive = true;
      return (
        <Badge
          variant={row.original.verified ? 'default' : 'secondary'}
          className={cn(
            'font-medium',
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    size: 100,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 80,
    enableSorting: false,
  },
];

export default columns;
