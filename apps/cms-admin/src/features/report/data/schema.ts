import { z } from 'zod';

export interface ReportType {
  id: string;
  name: string;
  category: string;
  // email: string;
  // role: ROLE;
  // verified?: boolean;
  // request: number;
  // request_page: number;
}

export interface ReportDataType {
  id: string;
  name: string;
  category: string;
  // email: string;
  // role: ROLE;
}

export const ReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  // email: z.string(),
  // role: z.enum(['CMS_CUSTOMER', 'CMS_ADMIN']),
});

export interface ReportCRUDType {
  name: string;
  // email: string;
  category: string;
  // role?: ROLE;
}

export type ROLE = 'CMS_CUSTOMER' | 'CMS_ADMIN';
