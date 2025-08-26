import type { MockCourse } from "../types/mockTypes";

export const mockCourse: MockCourse = {
  category: {
    id: 1,
    name: "Web Development",
  },
  course: {
    id: 1,
    name: "Angular - The Complete Guide (2025 Edition)",
    shortDescription:
      'Master Angular (formerly "Angular 2") and build awesome, reactive web apps with the successor of Angular.js',
    duration: "55 hours 48 minutes",
    modules: [
      {
        id: 1,
        name: "Getting Started",
        lessons: [
          {
            id: 1,
            title: "Welcome To The Course!",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "03:30",
          },
          {
            id: 2,
            title: "What Exactly is Angular?",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "05:30",
          },
          {
            id: 3,
            title: "Setting up the Development Environment",
            materialType: "Article",
            content: "https://angular.io/guide/setup-local",
            duration: "08:30",
          },
        ],
      },
      {
        id: 2,
        name: "Components & Templates",
        lessons: [
          {
            id: 1,
            title: "Introduction to Components",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "03:30",
          },
          {
            id: 2,
            title: "Template Syntax",
            materialType: "Article",
            content: "https://angular.io/guide/template-syntax",
            duration: "02:30",
          },
          {
            id: 3,
            title: "Data Binding & Events",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "11:30",
          },
          {
            id: 4,
            title: "Component Interaction",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "03:30",
          },
        ],
      },
      {
        id: 3,
        name: "Services & Dependency Injection",
        lessons: [
          {
            id: 1,
            title: "What are Services?",
            materialType: "Article",
            content: "https://angular.io/guide/architecture-services",
            duration: "06:30",
          },
          {
            id: 2,
            title: "Dependency Injection Explained",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "03:30",
          },
          {
            id: 3,
            title: "Creating and Injecting Services",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "09:30",
          },
        ],
      },
      {
        id: 4,
        name: "Routing & Navigation",
        lessons: [
          {
            id: 1,
            title: "Introduction to Angular Routing",
            materialType: "Article",
            content: "https://angular.io/guide/router",
            duration: "02:30",
          },
          {
            id: 2,
            title: "Configuring Routes",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "03:30",
          },
          {
            id: 3,
            title: "Route Guards & Lazy Loading",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "14:30",
          },
        ],
      },
      {
        id: 5,
        name: "Forms & Validation",
        lessons: [
          {
            id: 1,
            title: "Template-driven Forms",
            materialType: "Article",
            content: "https://angular.io/guide/forms",
            duration: "03:30",
          },
          {
            id: 2,
            title: "Reactive Forms",
            materialType: "Video",
            content: "https://youtu.be/dQw4w9WgXcQ",
            duration: "02:30",
          },
          {
            id: 3,
            title: "Form Validation Techniques",
            materialType: "Article",
            content: "https://angular.io/guide/form-validation",
            duration: "01:30",
          },
        ],
      },
    ],
  },
  instructor: {
    id: 1,
    name: "Vinn",
    email: "vinn@gmail.com",
    phoneNumber: "093,209,332",
    totalCourses: 30,
    totalStudents: 1000,
  },
};
