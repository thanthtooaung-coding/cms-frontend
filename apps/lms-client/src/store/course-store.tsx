import type { CourseData } from "../api/types/courseData";
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

interface CourseState {
    courseData: CourseData | null;
    setCourseData: (data: CourseData) => void;
    clearCourseData: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courseData: null,
      setCourseData: (data) => set({ courseData: data }),
      clearCourseData: () => set({ courseData: null }),
    }),
    {
      name: 'course-data-storage', // key in localStorage
    }
  )
);
