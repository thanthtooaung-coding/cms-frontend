import { z } from 'zod';

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // email: string;
  // role: ROLE;
  // name_space: string;
  // verified?: boolean;
  // request: number;
  // request_page: number;
}

export interface CategoryDataType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // email: string;
  // role: ROLE;
  // name_space: string;
}

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  // email: z.string(),
  // name_space: z.string(),
  // role: z.string(),
});

// export interface CategoryCRUDType {
//   name: string;
//   name_space?: string | null;
//   email: string;
//   description: string;
//   role?: ROLE;
// }

//export type ROLE = 'CMS_CUSTOMER' | 'CMS_ADMIN';
//export type ROLE = 'LMS_CUSTOMER' | 'LMS_ADMIN';
