import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type{ Course } from '../api/types/courseData'

// export interface Course {
//   id: string
//   title: string
//   instructor: string
//   rating: number
//   reviews: number
//   image: string
//   price: number
//   originalPrice?: number
//   description: string
//   duration: string
//   level: string
//   category: string
//   isHighestRated?: boolean
// }

interface WishlistStore {
  wishlist: Course[]
  addToWishlist: (course: Course) => void
  removeFromWishlist: (courseId: string) => void
  isInWishlist: (courseId: string) => boolean
  getWishlistCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (course) =>
        set((state) => ({
          wishlist: state.wishlist.some(item => item.id === course.id)
            ? state.wishlist
            : [...state.wishlist, course]
        })),
      removeFromWishlist: (courseId) =>
        set((state) => ({
          wishlist: state.wishlist.filter(course => course.id !== courseId)
        })),
      isInWishlist: (courseId) =>
        get().wishlist.some(course => course.id === courseId),
      getWishlistCount: () => get().wishlist.length
    }),
    {
      name: 'wishlist-storage'
    }
  )
)