import type { ColumnDef } from '@tanstack/react-table';
//import { Badge } from '@cms/ui/components/badge';
import { cn } from '@cms/ui/lib/utils';
//import { Hash } from 'lucide-react';
import { DataTableColumnHeader } from '@cms/ui/components/data-table-column-header';
import type { ReportType } from '../data/schema';
// import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@cms/ui/components/checkbox';
import { Link } from 'react-router-dom';

export const columns: ColumnDef<ReportType>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          {/* <span className="font-semibold text-base leading-tight max-w-48">
            {row.original.name}
          </span> */}
          <Link
            to={`/userListing`} // Adjust path & param as needed
            className="font-semibold text-base leading-tight max-w-48 text-blue-600 hover:underline cursor-pointer"
          >
            {row.original.name}
          </Link>
          {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>ID: {row.original.id}</span>
          </div> */}
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
          <span className=" text-base leading-tight max-w-48">{row.original.category}</span>
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
  // {
  //   accessorKey: 'Requests',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="requests" />,
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-3">
  //       <div className="flex flex-col gap-1 min-w-0">
  //         <span className=" text-base leading-tight max-w-48">{row.original.request}</span>
  //       </div>
  //     </div>
  //   ),
  //   size: 300,
  //   meta: {
  //     className: cn(
  //       'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
  //       'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
  //       'sticky left-16 z-10'
  //     ),
  //   },
  // },
  // {
  //   accessorKey: 'Pages',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="page" />,
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-3">
  //       <div className="flex flex-col gap-1 min-w-0">
  //         <span className=" text-base leading-tight max-w-48">{row.original.request_page}</span>
  //       </div>
  //     </div>
  //   ),
  //   size: 300,
  //   meta: {
  //     className: cn(
  //       'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
  //       'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
  //       'sticky left-16 z-10'
  //     ),
  //   },
  // },

  // {
  //   accessorKey: 'verified',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  //   cell: ({ row }) => {
  //     const isActive = true;
  //     return (
  //       <Badge
  //         variant={row.original.verified ? 'default' : 'secondary'}
  //         className={cn(
  //           'font-medium',
  //           isActive
  //             ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  //             : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  //         )}
  //       >
  //         {isActive ? 'Active' : 'Inactive'}
  //       </Badge>
  //     );
  //   },
  //   size: 100,
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },

  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  //   size: 80,
  //   enableSorting: false,
  // },
];

export default columns;
