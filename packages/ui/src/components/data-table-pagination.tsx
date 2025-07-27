import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from './button.jsx';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from './select.js';
import { Input } from './input.jsx';
import React from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageSizeOptions = [5, 10, 20, 30, 40, 50];
  const OTHER_VALUE = 'other';

  const [customPageSize, setCustomPageSize] = React.useState<string>(
    table.getState().pagination.pageSize.toString()
  );
  // Determine if the current page size is one of the predefined options or "other"
  const initialSelectValue = pageSizeOptions.includes(table.getState().pagination.pageSize)
    ? table.getState().pagination.pageSize.toString()
    : OTHER_VALUE;

  const [selectedSelectValue, setSelectedSelectValue] = React.useState<string>(initialSelectValue);

  React.useEffect(() => {
    const currentPageSize = table.getState().pagination.pageSize;
    if (pageSizeOptions.includes(currentPageSize)) {
      setSelectedSelectValue(currentPageSize.toString());
      setCustomPageSize(currentPageSize.toString()); // Keep custom input in sync
    } else {
      setSelectedSelectValue(OTHER_VALUE);
      setCustomPageSize(currentPageSize.toString());
    }
  }, [table.getState().pagination.pageSize]);

  const handleSelectChange = (value: string) => {
    setSelectedSelectValue(value);
    if (value === OTHER_VALUE) {
      // If "Other" is selected, don't change table page size immediately
      // The input field will handle this when the user types
      // Set customPageSize to the current table pageSize as a starting point for "Other"
      setCustomPageSize(table.getState().pagination.pageSize.toString());
    } else {
      const numValue = Number(value);
      table.setPageSize(numValue);
      setCustomPageSize(value); // Keep custom input in sync
    }
  };

  const handleCustomPageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPageSize(value);

    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      table.setPageSize(numValue);
    }
  };

  const handleCustomPageSizeBlur = () => {
    const numValue = Number(customPageSize);
    if (isNaN(numValue) || numValue <= 0) {
      // If invalid, revert custom input to current valid page size
      setCustomPageSize(table.getState().pagination.pageSize.toString());
    }
    // If a valid number was typed, table.setPageSize was already called in handleChange
    // No need to call it again here.
  };

  const isCustomInputVisible = selectedSelectValue === OTHER_VALUE;

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select value={selectedSelectValue} onValueChange={handleSelectChange}>
            <SelectTrigger className="h-8 w-[90px]">
              {' '}
              {/* Increased width for "Other" */}
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
              <SelectItem key={OTHER_VALUE} value={OTHER_VALUE}>
                Other
              </SelectItem>
            </SelectContent>
          </Select>

          {isCustomInputVisible && (
            <Input
              type="number"
              min="1"
              value={customPageSize}
              onChange={handleCustomPageSizeChange}
              onBlur={handleCustomPageSizeBlur}
              className="h-8 w-[70px] text-center"
              placeholder="Enter #"
            />
          )}
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
