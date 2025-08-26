import type { EnrollmentType } from "./schema";


export const mockEnrollments: EnrollmentType[] = [
  {
    id: '1',
    studentName: 'Emily Carter',
    studentEmail: 'emily.carter@example.com',
    courseName: 'Fundamentals of JavaScript',
    category: 'Programming',
    createdAt: '2025-07-20',
  },
  {
    id: '2',
    studentName: 'Michael Lee',
    studentEmail: 'michael.lee@example.com',
    courseName: 'UI/UX Design Basics',
    category: 'Design',
    createdAt: '2025-07-09',
  },
  {
    id: '3',
    studentName: 'Sophia Brown',
    studentEmail: 'sophia.brown@example.com',
    courseName: 'Data Analysis with Python',
    category: 'Data Science',
    createdAt: '2025-07-17',
  },
  {
    id: '4',
    studentName: 'Daniel Wilson',
    studentEmail: 'daniel.wilson@example.com',
    courseName: 'Project Management Essentials',
    category: 'Business',
    createdAt: '2025-07-12',
  },
];
