// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { PageList } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type pageListDialogType = 'add' | 'edit' | 'delete' | 'status-select';

interface pageListContextType {
  open: pageListDialogType | null;
  setOpen: (str: pageListDialogType | null) => void;
  currentRow: pageListDialogType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<PageList | null>>;
}

const PageListContext = createContext<pageListContextType | null>(null);

interface pageListProps {
  children: React.ReactNode;
}

export const PageListProvider: React.FC<pageListProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<PageList>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<PageList | null>> = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) => (value as (prev: PageList | null) => PageList | null)(prev));
    } else {
      setCurrentRow(value);
    }
  };

  const value: pageListContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <PageListContext.Provider value={value}>{children}</PageListContext.Provider>;
};

export const usePage = () => {
  const pageListContentProvider = React.useContext(PageListContext);

  if (!pageListContentProvider) {
    throw new Error('Page has to be used within <PageContext>');
  }

  return pageListContentProvider;
};
