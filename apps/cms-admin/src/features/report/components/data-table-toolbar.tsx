import type { Table } from '@tanstack/react-table';

import { Button } from '@cms/ui/components/button';
import { Trash } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onDelete: (selectedRows: TData[]) => void; // <-- add this
}

export function DataTableToolbar<TData>({ table, onDelete }: DataTableToolbarProps<TData>) {
  // Get the number of selected rows
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    if (selectedRows.length > 0) {
      onDelete(selectedRows);
    } else {
      console.log('No rows selected for deletion.');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div></div>
        {selectedRowCount > 0 && (
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              onClick={handleDeleteSelected}
              className="ml-auto cursor-pointer "
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedRowCount})
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="ml-auto cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" />
              Force Delete Selected ({selectedRowCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
