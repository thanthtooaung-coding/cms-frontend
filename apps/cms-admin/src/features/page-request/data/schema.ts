import { z } from 'zod';

export interface PageRequestType {
  id: string;
  pageName: string;
  pageUrl: string;
  userName: string;
  userEmail: string;
  requestDate: string;
}

export const PageRequestSchema = z.object({
  id: z.string(),
  pageName: z.string(),
  pageUrl: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  requestDate: z.string(),
});
