// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { PageRequestType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type pageRequestDialogType = 'add' | 'edit' | 'delete';

interface pageRequestContextType {
  open: pageRequestDialogType | null;
  setOpen: (str: pageRequestDialogType | null) => void;
  currentRow: pageRequestDialogType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<PageRequestType | null>>;
}

const PageRequestContext = createContext<pageRequestContextType | null>(null);

interface pageRequestProps {
  children: React.ReactNode;
}

export const PageRequestProvider: React.FC<pageRequestProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<PageRequestType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<PageRequestType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: PageRequestType | null) => PageRequestType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: pageRequestContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <PageRequestContext.Provider value={value}>{children}</PageRequestContext.Provider>;
};

export const usePageRequest = () => {
  const PageRequestContentProvider = React.useContext(PageRequestContext);

  if (!PageRequestContentProvider) {
    throw new Error('Page Request has to be used within <PageRequestContext>');
  }

  return PageRequestContentProvider;
};
