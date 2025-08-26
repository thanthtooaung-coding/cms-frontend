import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cms/ui/components/form';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { Card, CardContent, CardHeader } from '@cms/ui/components/card';
import { Textarea } from '@cms/ui/components/textarea';

import { PlusCircle, XCircle } from 'lucide-react';

// Validation schema using zod
const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  content: z.string().min(1, 'Lesson content is required'),
  materialType: z.enum(['Video', 'PDF', 'Slide', 'Link']),
});

const moduleSchema = z.object({
  name: z.string().min(1, 'Module name is required'),
  description: z.string().min(1, 'Module description is required'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required'),
});

const CourseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.number().min(1, 'Category is required'),
  instructorId: z.number().min(1, 'Instructor is required'),
  durationDayCount: z.number().min(1, 'Duration is required'),
  modules: z.array(moduleSchema).min(1, 'At least one module is required'),
});

type CreateCourseData = z.infer<typeof CourseSchema>;

const ModuleForm = ({
  moduleIndex,
  control,
  removeModule,
}: {
  moduleIndex: number;
  control: any;
  removeModule: (index: number) => void;
}) => {
  const {
    fields: lessonFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`,
  });

  return (
    <Card className="relative mb-6">
      <Button
        type="button"
        onClick={() => removeModule(moduleIndex)}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
      >
        <XCircle className="h-5 w-5" />
      </Button>

      <CardHeader>
        <FormField
          control={control}
          name={`modules.${moduleIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Name</FormLabel>
              <FormControl>
                <Input placeholder="Module Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`modules.${moduleIndex}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Module Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardHeader>

      <CardContent>
        <h4 className="text-lg font-semibold mb-2">Lessons</h4>
        {lessonFields.map((lesson, lessonIndex) => (
          <div key={lesson.id} className="space-y-2 border p-4 rounded relative mb-4">
            <Button
              type="button"
              onClick={() => remove(lessonIndex)}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <XCircle className="h-4 w-4" />
            </Button>

            <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lesson Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.materialType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a material type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Slide">Slide</SelectItem>
                        <SelectItem value="Link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button type="button" onClick={() => append({ title: '', content: '', materialType: 'Video' })} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
        </Button>
      </CardContent>
    </Card>
  );
};

const CreateCourse = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const navigate = useNavigate();

  const form = useForm<CreateCourseData>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: '',
      description: '',
      modules: [],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?role=Staff`);
        if (!response.ok) {
          throw new Error('Failed to fetch instructors');
        }
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchInstructors();
  }, []);

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  const onSubmit = async (data: CreateCourseData) => {
    try {
      // 1. Create Course
      const courseRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          instructorId: data.instructorId,
          durationDayCount: data.durationDayCount,
        }),
      });
  
      if (!courseRes.ok) throw new Error('Failed to create course');
      const course = await courseRes.json();
      const courseId = course.id;
  
      // 2. Create Modules
      for (const module of data.modules) {
        const moduleRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: module.name,
            description: module.description,
            courseId,
          }),
        });
  
        if (!moduleRes.ok) throw new Error('Failed to create module');
        const createdModule = await moduleRes.json();
        const moduleId = createdModule.id;
  
        // 3. Create Lessons
        for (const lesson of module.lessons) {
          const lessonRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lessons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: lesson.title,
              content: lesson.content,
              materialType: lesson.materialType,
              moduleId,
            }),
          });
  
          if (!lessonRes.ok) throw new Error('Failed to create lesson');
        }
      }
  
      navigate('/course');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full py-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create New Course</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id.toString()}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationDayCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter duration in days" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Modules</h3>
              <Button
                type="button"
                onClick={() =>
                  appendModule({
                    name: '',
                    description: '',
                    lessons: [{ title: '', content: '', materialType: 'Video' }],
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
              </Button>
            </div>

            {moduleFields.length === 0 && <p className="text-muted-foreground">No modules yet. Add one to get started.</p>}

            {moduleFields.map((field, moduleIndex) => (
              <ModuleForm
                key={field.id}
                moduleIndex={moduleIndex}
                control={form.control}
                removeModule={removeModule}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/course')}>
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourse;