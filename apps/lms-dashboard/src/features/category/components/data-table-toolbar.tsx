import { useState } from 'react';
import type { Table } from '@tanstack/react-table';

import { Button } from '@cms/ui/components/button';
import { Trash } from 'lucide-react';
import { CategoryBulkDeleteDialog } from '../actions/category-bulk-delete-dialog';
import { CategoryForceDeleteDialog } from '../actions/category-force-delete-dialog';
import type { CategoryDataType } from '../data/schema';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [forceDeleteOpen, setForceDeleteOpen] = useState(false);

  // Get the number of selected rows
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const selectedCategories = table.getFilteredSelectedRowModel().rows.map(
    (row) => row.original as CategoryDataType
  );

  const handleBulkDelete = () => {
    setBulkDeleteOpen(true);
  };

  const handleForceDelete = () => {
    setForceDeleteOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          <div></div>
          {selectedRowCount > 0 && (
            <div className="flex items-center space-x-4">
              <Button
                variant="default"
                onClick={handleBulkDelete}
                className="ml-auto cursor-pointer "
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected ({selectedRowCount})
              </Button>
              <Button
                variant="destructive"
                onClick={handleForceDelete}
                className="ml-auto cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" />
                Force Delete Selected ({selectedRowCount})
              </Button>
            </div>
          )}
        </div>
      </div>

      <CategoryBulkDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        selectedCategories={selectedCategories}
      />

      <CategoryForceDeleteDialog
        open={forceDeleteOpen}
        onOpenChange={setForceDeleteOpen}
        selectedCategories={selectedCategories}
      />
    </>
  );
}
