import { z } from 'zod';

export type ROLE = 'Owner' | 'CMS_ADMIN';
const ROLE_ENUM = z.enum(['Owner', 'CMS_ADMIN']);

const RoleSchema = z.object({
  id: z.number(),
  name: ROLE_ENUM,
});

export type OwnerType = z.infer<typeof OwnerSchema>;

export interface OwnerDataType {
  id: string;
  name: string;
  email: string;
  role: ROLE;
}

export const OwnerSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  role: RoleSchema.optional(),
  numberOfRequestPages: z.number().optional(),
  numberOfPagesOwned: z.number().optional(),
  verified: z.boolean().optional(),
});

export interface OwnerCRUDType {
  name: string;
  email: string;
  role?: ROLE | undefined;
}

