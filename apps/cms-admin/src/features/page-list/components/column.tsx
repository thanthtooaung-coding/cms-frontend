import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@cms/ui/lib/utils';
import { Hash, ExternalLink } from 'lucide-react';
import { DataTableColumnHeader } from '@cms/ui/components/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@cms/ui/components/checkbox';
import type { PageList } from '../data/schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '@cms/ui/components/tooltip';

export const columns: ColumnDef<PageList>[] = [
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
    accessorKey: 'pageName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Page Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-base leading-tight max-w-48">
            {row.original.pageName}
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
    accessorKey: 'pageUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Page URL" />,
    cell: ({ row }) => {
      const url = row.original.pageUrl;
      if (!url || url.trim() === '') {
        return (
          <div className="flex items-center gap-2 min-w-0 max-w-[400px]">
            <span className="text-sm text-muted-foreground">No URL available</span>
          </div>
        );
      }
      const formatUrl = (url: string, maxLength: number = 50) => {
        try {
          // If URL doesn't have protocol, add http:// for parsing
          const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
            ? url 
            : `http://${url}`;
          const urlObj = new URL(urlWithProtocol);
          const display = urlObj.hostname + urlObj.pathname;
          if (display.length <= maxLength) {
            return { display, full: url };
          }
          return {
            display: display.substring(0, maxLength - 3) + '...',
            full: url,
          };
        } catch {
          if (url.length <= maxLength) {
            return { display: url, full: url };
          }
          return {
            display: url.substring(0, maxLength - 3) + '...',
            full: url,
          };
        }
      };

      const { display, full } = formatUrl(url, 55);
      const isTruncated = display !== full;
      // Ensure URL has protocol for external link
      const fullUrl = full.startsWith('http://') || full.startsWith('https://') 
        ? full 
        : `http://${full}`;

      return (
        <div className="flex items-center gap-2 min-w-0 max-w-[400px]">
          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {isTruncated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm text-blue-600 hover:text-blue-800 hover:underline",
                    "truncate flex-1 min-w-0",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  )}
                >
                  {display}
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-md break-all">
                <p className="text-xs">{full}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm text-blue-600 hover:text-blue-800 hover:underline",
                "truncate flex-1 min-w-0",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              )}
            >
              {display}
            </a>
          )}
        </div>
      );
    },
    size: 350,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
  },
  {
    accessorKey: 'ownerName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.ownerName}</span>
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
    accessorKey: 'ownerEmail',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner Email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.ownerEmail}</span>
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
    accessorKey: 'pageStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Page Status" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className=" text-base leading-tight max-w-48">{row.original.pageStatus}</span>
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
