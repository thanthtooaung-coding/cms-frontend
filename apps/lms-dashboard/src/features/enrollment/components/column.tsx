import type { ColumnDef } from '@tanstack/react-table';

import { cn } from '@cms/ui/lib/utils';

import { Hash } from 'lucide-react';
import { DataTableColumnHeader } from '@cms/ui/components/data-table-column-header';

import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@cms/ui/components/checkbox';
import type { EnrollmentType } from '../data/schema';
import { Link } from 'react-router';

export const columns: ColumnDef<EnrollmentType>[] = [
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
    accessorKey: 'studentName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Student Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base leading-tight max-w-48">
            {row.original.studentName}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>ID: {row.original.id}</span>
          </div>
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
    accessorKey: 'studentEmail',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Student Email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.studentEmail}</span>
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
    accessorKey: 'courseName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Course" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <Link
            to={row.original.courseName}
            className="text-base leading-tight max-w-48 text-blue-600 hover:underline break-words"
          >
            <span className=" text-base leading-tight max-w-48">{row.original.courseName}</span>
          </Link>
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
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <Link
            to={row.original.category}
            className="text-base leading-tight max-w-48 text-blue-600 hover:underline break-words"
          >
            <span className=" text-base leading-tight max-w-48">{row.original.category}</span>
          </Link>
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
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.createdAt}</span>
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
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 80,
    enableSorting: false,
  },
];

export default columns;
