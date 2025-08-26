import React, { createContext } from 'react';
import type { InstructorDataType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type instructorDialogType = 'add' | 'edit' | 'delete';

interface InstructorContextType {
  open: instructorDialogType | null;
  setOpen: (str: instructorDialogType | null) => void;
  currentRow: InstructorDataType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<InstructorDataType | null>>;
}

const InstructorContext = createContext<InstructorContextType | null>(null);

interface InstructorProps {
  children: React.ReactNode;
}

export const InstructorProvider: React.FC<InstructorProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<InstructorDataType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<InstructorDataType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: InstructorDataType | null) => InstructorDataType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: InstructorContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return React.createElement(
    InstructorContext.Provider,
    { value },
    children
  );
};

export const useInstructor = () => {
  const InstructorContentProvider = React.useContext(InstructorContext);
  
  if (!InstructorContentProvider) {
    throw new Error('Instructor has to be used within <InstructorContext>');
  }

  return InstructorContentProvider;
};
