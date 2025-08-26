// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { CategoryDataType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type categoryDialogType = 'add' | 'edit' | 'delete';

interface CategoryContextType {
  open: categoryDialogType | null;
  setOpen: (str: categoryDialogType | null) => void;
  currentRow: CategoryDataType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<CategoryDataType | null>>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

interface CategoryProps {
  children: React.ReactNode;
}

export const CategoryProvider: React.FC<CategoryProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<CategoryDataType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<CategoryDataType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: CategoryDataType | null) => CategoryDataType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: CategoryContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
  const CategoryContentProvider = React.useContext(CategoryContext);

  if (!CategoryContentProvider) {
    throw new Error('Owner has to be used within <OwnerContext>');
  }

  return CategoryContentProvider;
};
