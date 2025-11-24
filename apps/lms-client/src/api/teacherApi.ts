// API functions for teacher/instructor data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api/lms';

export interface TeacherResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  role: {
    id: number;
    name: string;
  };
  tenant: {
    id: number;
    name: string;
  };
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    description?: string;
  };
  instructor: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Fetch teacher/instructor details by ID
 */
export async function fetchTeacherById(teacherId: number): Promise<TeacherResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${teacherId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch teacher: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all courses (we'll filter by instructor on the client side)
 */
export async function fetchAllCourses(): Promise<CourseResponse[]> {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch courses by instructor ID
 */
export async function fetchCoursesByInstructor(instructorId: number): Promise<CourseResponse[]> {
  const allCourses = await fetchAllCourses();
  return allCourses.filter(course => course.instructor?.id === instructorId);
}

