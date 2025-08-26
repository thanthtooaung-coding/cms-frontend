import { create } from 'zustand';
import type { CategoryType } from '../features/category/data/schema';
import { mockCategory } from '../features/category/data/mockData';

type CategoryState = {
  categories: CategoryType[];
  addCategory: (category: CategoryType) => void;
};

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: mockCategory,
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
}));
