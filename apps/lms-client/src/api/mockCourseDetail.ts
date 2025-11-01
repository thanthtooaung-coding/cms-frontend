// mockCourseDetail.ts

import type { mockCourse } from "@cms/data/src/data/mockData";

export interface Category {
  id: number;
  name: string;
}

export interface Rating {
  averageRating: number;
  totalRating: number;
}

export interface WhatYouWillLearnItem {
  id: number;
  text: string;
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
  modules: any[]; // You can expand this later
  requirements: Requirement[];
  description: string;
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

export const mockCourseDetail: CourseDetailResponse = {
  category: {
    id: 1,
    name: 'Artificial Intelligence',
  },
  course: {
    id: 101,
    name: 'AI Masterclass: Build Intelligent Systems with Python (2025 Edition)',
    shortDescription:
      'Master the foundations of AI, build real-world applications using machine learning, deep learning, and NLP with Python.',
    rating: {
      averageRating: 4.8,
      totalRating: 532,
    },
    totalEnrolledStudents: 12500,
    createdAt: '2025-06-10T00:00:00Z',
    updatedAt: '2025-07-30T00:00:00Z',
    whatYouWillLearn: [
      { id: 1, text: 'Build powerful full-stack apps with the MERN stack' },
      { id: 2, text: 'Deploy and manage web applications on cloud platforms' },
      { id: 3, text: 'Design and implement RESTful APIs using Express.js' },
      { id: 4, text: 'Master MongoDB for flexible and scalable data storage' },
      { id: 5, text: 'Use React to build dynamic and responsive user interfaces' },
      { id: 6, text: 'Handle user authentication and authorization securely' },
      { id: 7, text: 'Understand how to manage application state effectively' },
      { id: 8, text: 'Use Git and GitHub for version control and collaboration' },
      { id: 9, text: 'Integrate third-party APIs and services into applications' },
      { id: 10, text: 'Optimize performance and scalability of web apps' },
      { id: 11, text: 'Test your code using unit, integration, and end-to-end tests' },
      {
        id: 12,
        text: 'Implement responsive design with CSS frameworks like Tailwind or Bootstrap',
      },
      { id: 13, text: 'Work with WebSockets for real-time communication' },
      { id: 14, text: 'Set up continuous integration and deployment (CI/CD)' },
      { id: 15, text: 'Understand core principles of software architecture' },
      { id: 16, text: 'Build and manage modern development environments using Docker' },
      { id: 17, text: 'Debug and monitor applications using modern tools and techniques' },
    ],
    duration: '72 hours 15 minutes',
    modules: [],
    requirements: [
      {
        id: 1,
        text: 'Basic Python programming knowledge is recommended.',
      },
      {
        id: 2,
        text: 'No prior AI or ML experience required.',
      },
    ],
    description:
      "This comprehensive course covers everything from basic AI concepts to advanced deep learning models. Learn how to build intelligent systems, from virtual assistants to autonomous machines. You'll use Python, TensorFlow, PyTorch, and industry-proven tools to implement and deploy real AI projects.",
  },
  instructor: {
    id: 7,
    name: 'Dr. Ava Sharma',
    email: 'ava.sharma@aiuniversity.com',
    phoneNumber: '555-123-4567',
    totalCourses: 12,
    totalStudents: 48000,
  },
};
// export const mockCourseDetail: CourseDetailResponse = {
//   category: {
//     id: 1,
//     name: 'Web Development',
//   },
//   course: {
//     id: 5,
//     name: 'Full-Stack Web Development with MERN',
//     imgUrl:
//       'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
//     shortDescription: 'Become a full-stack developer using MongoDB, Express, React, and Node.js.',
//     rating: {
//       averageRating: 4.9,
//       totalRating: 910,
//     },
//     totalEnrolledStudents: 6800,
//     createdAt: '',
//     updatedAt: '',
//     whatYouWillLearn: [
//       { id: 1, text: 'Build powerful full-stack apps with the MERN stack' },
//       { id: 2, text: 'Deploy and manage web applications on cloud platforms' },
//       { id: 3, text: 'Design and implement RESTful APIs using Express.js' },
//       { id: 4, text: 'Master MongoDB for flexible and scalable data storage' },
//       { id: 5, text: 'Use React to build dynamic and responsive user interfaces' },
//       { id: 6, text: 'Handle user authentication and authorization securely' },
//       { id: 7, text: 'Understand how to manage application state effectively' },
//       { id: 8, text: 'Use Git and GitHub for version control and collaboration' },
//       { id: 9, text: 'Integrate third-party APIs and services into applications' },
//       { id: 10, text: 'Optimize performance and scalability of web apps' },
//       { id: 11, text: 'Test your code using unit, integration, and end-to-end tests' },
//       {
//         id: 12,
//         text: 'Implement responsive design with CSS frameworks like Tailwind or Bootstrap',
//       },
//       { id: 13, text: 'Work with WebSockets for real-time communication' },
//       { id: 14, text: 'Set up continuous integration and deployment (CI/CD)' },
//       { id: 15, text: 'Understand core principles of software architecture' },
//       { id: 16, text: 'Build and manage modern development environments using Docker' },
//       { id: 17, text: 'Debug and monitor applications using modern tools and techniques' },
//     ],
//     duration: '65 hours 30 minutes',
//     modules: [
//       {
//         id: 1,
//         name: 'Setting Up MERN Environment',
//         lessons: [
//           {
//             id: 1,
//             title: 'Installing Node.js and MongoDB',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/oOpdX35ZeK0?si=HEscVbzGiF8VN8CF',
//           },
//           {
//             id: 2,
//             title: 'Building a REST API with Express.js',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/pKd0Rpw7O48?si=LgUDoHVa9L-7eRxL',
//           },
//           {
//             id: 3,
//             title: 'Connecting Node.js to MongoDB',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/TlB_eWDSMt4?si=w8B3Dh0jMPCSh-MD',
//           },
//         ],
//       },
//       {
//         id: 2,
//         name: 'React Fundamentals',
//         lessons: [
//           {
//             id: 1,
//             title: 'Introduction to React',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/JJSoEo8JSnc',
//           },
//           {
//             id: 2,
//             title: 'React Components and Props',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/dpw9EHDh2bM',
//           },
//           {
//             id: 3,
//             title: 'State and Lifecycle in React',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/DPnqb74Smug',
//           },
//         ],
//       },
//       {
//         id: 4,
//         name: 'Express.js Advanced',
//         lessons: [
//           {
//             id: 1,
//             title: 'Middleware in Express',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/L72fhGm1tfE',
//           },
//           {
//             id: 2,
//             title: 'Authentication with JWT',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/7Q17ubqLfaM',
//           },
//           {
//             id: 3,
//             title: 'Error Handling and Debugging',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/gnsO8-xJ8rs',
//           },
//         ],
//       },

//       {
//         id: 5,
//         name: 'Frontend Routing with React Router',
//         lessons: [
//           {
//             id: 1,
//             title: 'Setting Up React Router',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/oPpnCh7InLY',
//           },
//         ],
//       },
//       {
//         id: 6,
//         name: 'Working with Redux for State Management',
//         lessons: [
//           {
//             id: 1,
//             title: 'Introduction to Redux',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/poQXNp9ItL4',
//           },
//           {
//             id: 2,
//             title: 'Redux Toolkit and Setup',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/9zySeP5vH9c',
//           },
//           {
//             id: 3,
//             title: 'Using Redux with React Components',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/t2ypzz6gJm0',
//           },
//         ],
//       },
//       {
//         id: 8,
//         name: 'Advanced Authentication Techniques',
//         lessons: [
//           {
//             id: 1,
//             title: 'JWT Authentication in Node.js',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/mbsmsi7l3r4',
//           },
//           {
//             id: 2,
//             title: 'OAuth 2.0 and Google Login Integration',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/Z1ktxiqyiLA',
//           },
//           {
//             id: 3,
//             title: 'Session vs Token-Based Authentication',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/X3qyxo_UTR4',
//           },
//         ],
//       },

//       {
//         id: 8,
//         name: 'Deploying MERN Apps',
//         lessons: [
//           {
//             id: 1,
//             title: 'Preparing Your App for Deployment',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/gYzHS-n2gqU',
//           },
//           {
//             id: 2,
//             title: 'Deploying with Heroku and Vercel',
//             materialType: 'Video',
//             content: 'https://www.youtube.com/embed/71wSzpLyW9k',
//           },
//         ],
//       },
//     ],
//     requirements: [{ id: 1, text: 'Basic HTML, CSS & JS knowledge' }],
//     description: 'From front-end to back-end, become a MERN stack expert.',
//   },
//   instructor: {
//     id: 5,
//     name: 'Jake Miller',
//     email: 'jake.miller@webhero.com',
//     phoneNumber: '089-309-9942',
//     totalCourses: 22,
//     totalStudents: 11000,
//   },
// };