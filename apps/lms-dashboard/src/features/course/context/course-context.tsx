// src/features/category/context/category-context.tsx
import React, { createContext } from 'react';
import type { Course } from '../data/schema';
import { useCrudDialog } from '../../../hooks/use-crud-dialog';

type courseDialogType = 'add' | 'edit' | 'delete' |'change-status';

interface CourseContextType {
  open: courseDialogType | null;
  setOpen: (str: courseDialogType | null) => void;
  currentRow: Course | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Course | null>>;
}

const CourseContext = createContext<CourseContextType | null>(null);

interface courseProps {
  children: React.ReactNode;
}

export const CourseProvider: React.FC<courseProps> = ({ children }) => {
  // Use the new custom hook
  const { open, setOpen, currentRow, setCurrentRow } = useCrudDialog<Course>();

  const setCurrentRowCompat: React.Dispatch<React.SetStateAction<Course | null>> = (value) => {
    if (typeof value === 'function') {
      // @ts-ignore
      setCurrentRow((prev) => (value as (prev: Course | null) => Course | null)(prev));
    } else {
      setCurrentRow(value);
    }
  };

  const value: CourseContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow: setCurrentRowCompat,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const courseContentProvider = React.useContext(CourseContext);

  if (!courseContentProvider) {
    throw new Error('Page has to be used within <PageContext>');
  }

  return courseContentProvider;
};
