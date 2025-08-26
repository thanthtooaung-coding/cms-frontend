// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { OwnerDataType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type ownerDialogType = 'add' | 'edit' | 'delete';

interface OwnerContextType {
  open: ownerDialogType | null;
  setOpen: (str: ownerDialogType | null) => void;
  currentRow: OwnerDataType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<OwnerDataType | null>>;
}

const OwnerContext = createContext<OwnerContextType | null>(null);

interface OwnerProps {
  children: React.ReactNode;
}

export const OwnerProvider: React.FC<OwnerProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<OwnerDataType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<OwnerDataType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: OwnerDataType | null) => OwnerDataType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: OwnerContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
};

export const useOwner = () => {
  const OwnerContentProvider = React.useContext(OwnerContext);

  if (!OwnerContentProvider) {
    throw new Error('Owner has to be used within <OwnerContext>');
  }

  return OwnerContentProvider;
};
