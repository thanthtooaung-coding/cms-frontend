import { useState } from 'react';

type CrudDialogType = 'add' | 'edit' | 'delete';

interface CrudDialogState<T> {
  open: CrudDialogType | null;
  setOpen: (state: CrudDialogType | null) => void;
  currentRow: T | null;
  setCurrentRow: (row: T | null) => void;
  clearCurrentRow: () => void;
}

export function useCrudDialog<T>(): CrudDialogState<T> {
  const [open, setOpen] = useState<CrudDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<T | null>(null);

  const clearCurrentRow = () => setCurrentRow(null);

  return {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    clearCurrentRow,
  };
}
