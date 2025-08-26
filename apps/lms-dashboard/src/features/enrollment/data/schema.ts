import { z } from 'zod';

export interface EnrollmentType {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName : string,
  category : string,
  createdAt : string ,
  // role?: ROLE;
}

export interface EnrollmentDataType {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName : string,
  category : string,
  createdAt : string,
  // role?: ROLE;
}

export const EnrollmentSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  studentEmail: z.string(),
  courseName: z.string(),
  category : z.string(),
  createdAt : z.string(),
  // role: z.enum(['INSTRUCTOR']),
});


export type ROLE =  'INSTRUCTOR';
