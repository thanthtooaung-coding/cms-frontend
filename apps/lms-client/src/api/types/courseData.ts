export interface CourseData {
  category: Category;
  course: Course;
  instructor: Instructor;
}

export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  shortDescription: string;
  rating: Rating;
  totalEnrolledStudents: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  whatYouWillLearn: WhatYouWillLearn[];
  duration: string; // e.g. '31 hours 1 minutes'
  modules: Module[];
  requirements: Requirement[];
  description: string;
  imgUrl: string;
}

export interface Rating {
  averageRating: number;
  totalRating: number;
}

export interface WhatYouWillLearn {
  id: number;
  text: string;
}

export interface Module {
  id: number;
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  materialType: 'Video' | 'Article' | 'Quiz' | string;
  content: string; // could be a URL or text depending on materialType
}

export interface Requirement {
  id: number;
  text: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  totalCourses: number;
  totalStudents: number;
}
