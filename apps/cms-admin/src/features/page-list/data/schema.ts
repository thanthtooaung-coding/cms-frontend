import {z} from 'zod'

export interface PageList {
    id : string  
    pageName: string;
    pageUrl: string;
    ownerName: string;
    ownerEmail: string;
    pageStatus: string;
}

export const PageListSchema = z.object({
    id: z.string(),
    pageName: z.string(),
    pageUrl: z.string(),
    ownerName: z.string(),
    ownerEmail: z.string(),
    pageStatus: z.string()
});
