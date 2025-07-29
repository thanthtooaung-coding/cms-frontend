// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { ReportDataType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type reportDialogType = 'add' | 'edit' | 'delete';

interface ReportContextType {
  open: reportDialogType | null;
  setOpen: (str: reportDialogType | null) => void;
  currentRow: ReportDataType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ReportDataType | null>>;
}

const ReportContext = createContext<ReportContextType | null>(null);

interface ReportProps {
  children: React.ReactNode;
}

export const ReportProvider: React.FC<ReportProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<ReportDataType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<ReportDataType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: ReportDataType | null) => ReportDataType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: ReportContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReport = () => {
  const ReportContentProvider = React.useContext(ReportContext);

  if (!ReportContentProvider) {
    throw new Error('Owner has to be used within <OwnerContext>');
  }

  return ReportContentProvider;
};
