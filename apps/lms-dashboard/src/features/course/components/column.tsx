import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@cms/ui/lib/utils';
//import { Hash } from 'lucide-react';
import { DataTableColumnHeader } from '@cms/ui/components/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@cms/ui/components/checkbox';
import { Link } from 'react-router';
import type { Course } from '../data/schema';

const slugify = (str : string) => str.toLowerCase().replace(/\s+/g, '-');

export const columns: ColumnDef<Course>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="No." />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base leading-tight max-w-48">{row.original.id}</span>
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
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base break-words whitespace-normal leading-tight max-w-48">
            {row.original.title}
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
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-base leading-tight break-words whitespace-normal max-w-[300px]">
              {row.original.description}
            </span>
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
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Link
          to={slugify(row.original.category)}
          className="text-base leading-tight max-w-48 text-blue-600 hover:underline break-words"
        >
          <span className=" text-base leading-tight max-w-48">{row.original.category}</span>
        </Link>
      </div>
    ),
    size: 300,
    // meta: {
    //   className: cn(
    //     'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
    //     'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    //     'sticky left-16 z-10'
    //   ),
    // },
  },
  {
    accessorKey: 'instructor',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Instructor" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Link
          to={slugify(row.original.instructor)}
          className="text-base leading-tight max-w-48 text-blue-600 hover:underline "
        >
          <span className=" text-base leading-tight max-w-48">{row.original.instructor}</span>
        </Link>
      </div>
    ),
    size: 300,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) =>
      // <div className="flex items-center gap-3">
      //   <div className="flex flex-col gap-1 min-w-0">
      //     <span className=" text-base leading-tight max-w-48">{row.original.status}</span>
      //   </div>
      // </div>
      // <div className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 transition-colors duration-200">
      //   <div className="flex flex-col gap-1 min-w-0">
      //     <span className="text-base leading-tight max-w-48">{row.original.status}</span>
      //   </div>
      // </div>
      {
        const status = row.original.status;
        const bgColor =
          status === 'published'
            ? 'bg-green-100 text-green-900'
            : status === 'unpublish'
              ? 'bg-amber-100 text-amber-900'
              : status === 'archived'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-indigo-100 text-indigo-900';
        return (
          <div className={`px-3 py-2 rounded-sm text-xs font-medium inline-block ${bgColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </div>
        );
      },

    size: 300,
    // meta: {
    //   className: cn(
    //     'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
    //     'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    //     'sticky left-16 z-10'
    //   ),
    // },
    // meta: {
    //   className: cn(
    //     'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
    //     'bg-blue-100 transition-colors duration-200 group-hover/row:bg-blue-200 group-data-[state=selected]/row:bg-blue-300',
    //     'sticky left-16 z-10'
    //   ),
    // },
  },

  {
    accessorKey: 'createAt',
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
