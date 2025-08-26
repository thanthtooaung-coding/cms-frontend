import { array, string, z } from 'zod';

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  createdAt: string; // ISO date string
  status: string;
}

export interface Lesson {
  id: number;
  title: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface CreateCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  modules: Module[];
}


export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  instructor: z.string(),
  status: z.string(),
  createdAt: z.string(), // optionally use `.datetime()` for validation
});

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
});

const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required'),
});

export const crateCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
  modules: z.array(moduleSchema).min(1, 'At least one module is required'),
});

export type CreateCourseData = z.infer<typeof crateCourseSchema>;

export interface LessonCRUDType {
  id?: string;
  title: string;
}

export interface ModuleCRUDType {
  id?: string;
  title: string;
  lessons: LessonCRUDType[];
}

export interface CourseCRUDType {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  modules: ModuleCRUDType[];
}


// const courseData = [
//   { 
//     id : string
//     title : string,
//     description : string,
//     category : string,
//     status : string,
//     module : [
//       id : string,
//       name : string,
//       lessons : [
//         id : string,
//         name : string
//       ]
//     ]
//   }
// ]



// import { z } from 'zod';
// export interface CategoryType {
//   id: string;
//   name: string;
//   image_url?: string | null;
//   created_at?: any;
// }

// export const CategorySchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   image_url: z.string().optional(),
// });

// export interface CategoryCRUDType {
//   name: string;
//   image_url?: string | null;
// }
