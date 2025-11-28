import { z } from 'zod';

export interface InstructorType {
  id: string;
  name: string;
  email: string;
  role: ROLE;
  name_space: string;
}

export interface InstructorDataType {
  id: string;
  name: string;
  email: string;
  role: ROLE;
  name_space: string;
}

export type ROLE = 'Admin' | 'Owner' | 'Staff' | 'Instructor';

export const InstructorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  name_space: z.string(),
  role: z.enum(['Admin', 'Owner', 'Staff', 'Instructor']),
});