// mockData.ts

export interface Rating {
  averageRating: number;
  totalRating: number;
}

export interface WhatYouWillLearnItem {
  id: number;
  text: string;
}

export interface Lesson {
  id: number;
  title: string;
  materialType: 'Video' | 'Image';
  content: string;
}

export interface Module {
  id: number;
  name: string;
  lessons: Lesson[];
}

export interface Requirement {
  id: number;
  text: string;
}

export interface Course {
  id: number;
  name: string;
  shortDescription: string;
  rating: Rating;
  totalEnrolledStudents: number;
  createdAt: string;
  updatedAt: string;
  whatYouWillLearn: WhatYouWillLearnItem[];
  duration: string;
  modules: Module[];
  requirements: Requirement[];
  description: string;
  imgUrl : string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  totalCourses: number;
  totalStudents: number;
}

export interface CourseDetailResponse {
  category: Category;
  course: Course;
  instructor: Instructor;
}

export const mockCourseDetailResponse: CourseDetailResponse = {
  category: {
    id: 1,
    name: 'Web Development',
  },
  course: {
    id: 1,
    name: 'Angular - The Complete Guide (2025 Edition)',
    shortDescription:
      'Master Angular (formerly "Angular 2") and build awesome, reactive web apps with the successor of Angular.js',
    rating: {
      averageRating: 4.7,
      totalRating: 217,
    },
    totalEnrolledStudents: 1000,
    createdAt: '2025-07-30T00:00:00Z',
    updatedAt: '2025-07-30T00:00:00Z',
    whatYouWillLearn: [
      {
        id: 1,
        text: 'Learn modern Angular, including standalone components & signals from the ground up & in great detail!',
      },
      {
        id: 2,
        text: 'Develop modern, complex, responsive and scalable web applications with Angular',
      },
      {
        id: 3,
        text: 'Understand and use TypeScript, the core language behind Angular',
      },
      {
        id: 4,
        text: 'Build and use reusable components and services',
      },
      {
        id: 5,
        text: 'Implement robust routing with lazy loading and guards',
      },
      {
        id: 6,
        text: 'Work with forms: template-driven and reactive approaches',
      },
      {
        id: 7,
        text: 'Connect to backends using HTTP client and observables',
      },
      {
        id: 8,
        text: 'Deploy Angular apps and optimize for production',
      },
    ],
    duration: '55 hours 48 minutes',
    modules: [
      {
        id: 1,
        name: 'Getting Started',
        lessons: [
          {
            id: 1,
            title: 'Welcome To The Course!',
            materialType: 'Video',
            content: 'https://youtu.be/example1',
          },
          {
            id: 2,
            title: 'What Exactly is Angular?',
            materialType: 'Video',
            content: 'https://youtu.be/example2',
          },
        ],
      },
      {
        id: 2,
        name: 'Components & Databinding',
        lessons: [
          {
            id: 3,
            title: 'Creating Components',
            materialType: 'Video',
            content: 'https://youtu.be/example3',
          },
          {
            id: 4,
            title: 'Understanding Databinding',
            materialType: 'Video',
            content: 'https://youtu.be/example4',
          },
        ],
      },
      {
        id: 3,
        name: 'Directives & Pipes',
        lessons: [
          {
            id: 5,
            title: 'Built-in Directives',
            materialType: 'Video',
            content: 'https://youtu.be/example5',
          },
          {
            id: 6,
            title: 'Creating Custom Pipes',
            materialType: 'Video',
            content: 'https://youtu.be/example6',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 1,
        text: 'NO prior Angular knowledge is required!',
      },
      {
        id: 2,
        text: 'Basic JavaScript & web development knowledge is required!',
      },
      {
        id: 3,
        text: 'Familiarity with HTML and CSS is helpful',
      },
      {
        id: 4,
        text: 'A modern browser and internet connection',
      },
      {
        id: 5,
        text: 'Enthusiasm to learn and build projects',
      },
    ],
    description:
      "This comprehensive Angular course will help you master the fundamentals and advanced concepts of Angular. Whether you're new to frontend development or a seasoned developer looking to upgrade your skills, this course has everything you need to build powerful, scalable applications with Angular.",
  },
  instructor: {
    id: 1,
    name: 'Vinn',
    email: 'vinn@gmail.com',
    phoneNumber: '093,209,332',
    totalCourses: 30,
    totalStudents: 1000,
  },
};
