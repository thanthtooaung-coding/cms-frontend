// Utility functions for course data transformation
import { lmsApiFetch } from './apiClient';

export interface BackendCourseResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  durationDayCount: number;
  category: {
    id: number;
    name: string;
    description: string;
  };
  instructor: {
    id: number;
    name: string;
    email: string;
    totalCourses?: number;
    totalStudents?: number;
  };
  modules?: Array<{
    id: number;
    name: string;
    description?: string;
    lessons?: Array<{
      id: number;
      title: string;
      content?: string;
      materialType?: string;
    }>;
  }>;
  rating?: {
    averageRating: number;
    totalRatings: number;
  };
  totalEnrolledStudents?: number;
  createdAt?: string;
  updatedAt?: string;
  whatYouWillLearn?: Array<{
    id: number;
    text: string;
  }>;
  requirements?: Array<{
    id: number;
    text: string;
  }>;
}

// Re-export CourseData from api/types to ensure type consistency
export type { CourseData } from '../api/types/courseData';

export function transformBackendCourseToCourseData(backendCourse: BackendCourseResponse): CourseData {
  // Convert durationDayCount to a readable format
  const durationDays = backendCourse.durationDayCount || 0;
  const durationHours = Math.floor(durationDays * 24 * 0.5); // Approximate: 0.5 hours per day
  const durationMinutes = Math.round((durationDays * 24 * 0.5 - durationHours) * 60);
  const durationText = durationHours > 0 
    ? `${durationHours} hours ${durationMinutes} minutes`
    : `${durationDays} days`;
  
  // Transform modules
  const modules = (backendCourse.modules || []).map(module => ({
    id: module.id,
    name: module.name,
    lessons: (module.lessons || []).map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      materialType: lesson.materialType || 'Video',
      content: lesson.content || '',
    })),
  }));

  return {
    course: {
      id: backendCourse.id,
      name: backendCourse.title,
      description: backendCourse.description,
      shortDescription: backendCourse.description ? backendCourse.description.substring(0, 100) + '...' : '',
      rating: {
        averageRating: backendCourse.rating?.averageRating || 4.5,
        totalRating: backendCourse.rating?.totalRatings || 0,
      },
      modules: modules,
      imgUrl: `https://picsum.photos/seed/${backendCourse.id}/400/225`, // Placeholder image
      duration: durationText,
      totalEnrolledStudents: backendCourse.totalEnrolledStudents || 0,
      createdAt: backendCourse.createdAt || new Date().toISOString(),
      updatedAt: backendCourse.updatedAt || new Date().toISOString(),
      whatYouWillLearn: backendCourse.whatYouWillLearn || [],
      requirements: backendCourse.requirements || [],
    },
    instructor: {
      id: backendCourse.instructor.id,
      name: backendCourse.instructor.name,
      email: backendCourse.instructor.email,
      phoneNumber: '',
      totalCourses: backendCourse.instructor.totalCourses ?? 0,
      totalStudents: backendCourse.instructor.totalStudents ?? 0,
    },
    category: {
      id: backendCourse.category.id,
      name: backendCourse.category.name,
    },
  };
}

export async function fetchPublishedCourses(): Promise<CourseData[]> {
  const response = await lmsApiFetch('/courses/public', {}, true);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  const backendCourses: BackendCourseResponse[] = await response.json();
  return backendCourses.map(transformBackendCourseToCourseData);
}

/**
 * Fetch a single course by ID
 */
export async function fetchCourseById(courseId: number): Promise<CourseData> {
  const response = await lmsApiFetch(`/courses/${courseId}`, {}, true);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Course not found');
    }
    throw new Error(`Failed to fetch course: ${response.statusText}`);
  }
  const backendCourse: BackendCourseResponse = await response.json();
  return transformBackendCourseToCourseData(backendCourse);
}

