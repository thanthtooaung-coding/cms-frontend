import React, { createContext } from 'react';
import type { EnrollmentDataType } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type enrollmentDialogType = 'add' | 'edit' | 'delete';

interface EnrollmentContextType {
  open: enrollmentDialogType | null;
  setOpen: (str: enrollmentDialogType | null) => void;
  currentRow: EnrollmentDataType | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<EnrollmentDataType | null>>;
}

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

interface EnrollmentProps {
  children: React.ReactNode;
}

export const EnrollmentProvider: React.FC<EnrollmentProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<EnrollmentDataType>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<EnrollmentDataType | null>> = (
    value
  ) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) =>
        (value as (prev: EnrollmentDataType | null) => EnrollmentDataType | null)(prev)
      );
    } else {
      setCurrentRow(value);
    }
  };

  const value: EnrollmentContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
};

export const useEnrollment = () => {
  const EnrollmentContentProvider = React.useContext(EnrollmentContext);

  if (!EnrollmentContentProvider) {
    throw new Error('Enrollment has to be used within <EnrollmentContext>')
  }

  return EnrollmentContentProvider;
};
