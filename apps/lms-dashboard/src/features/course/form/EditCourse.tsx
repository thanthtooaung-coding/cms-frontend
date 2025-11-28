import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTenantNavigate } from '../../../hooks/useTenantNavigate';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { lmsApiFetch } from '../../../utils/apiClient';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@cms/ui/components/form';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cms/ui/components/select';
import { Textarea } from '@cms/ui/components/textarea';
import { Card, CardContent, CardHeader } from '@cms/ui/components/card';
import { Loader2, PlusCircle, XCircle } from 'lucide-react';

// --- Interfaces ---
interface Category { id: number; name: string; }
interface Instructor { id: number; name: string; }
interface ApiModule { id: number; name: string; description: string; course: { id: number }; }
interface ApiLesson { id: number; title: string; content: string; materialType: 'Video' | 'PDF' | 'Slide' | 'Link'; }

// The shape of our assembled module data before setting it in the form
type ModuleWithLessons = {
  id: number;
  name: string;
  description: string;
  lessons: ApiLesson[];
}

// --- Zod validation schemas ---
const lessonSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Lesson title is required'),
  content: z.string().min(1, 'Lesson content is required'),
  materialType: z.enum(['Video', 'PDF', 'Slide', 'Link']),
});

const moduleSchema = z.object({
  id: z.number().optional(),
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
  status: z.enum(['Pending', 'Published', 'Unpublished', 'Archived']),
  modules: z.array(moduleSchema).min(1, 'At least one module is required'),
});

type CourseFormData = z.infer<typeof CourseSchema>;

// --- Reusable ModuleForm sub-component ---
const ModuleForm = ({ moduleIndex, control, removeModule }: { moduleIndex: number; control: any; removeModule: (index: number) => void; }) => {
  const { fields: lessonFields, append, remove } = useFieldArray({
    control, name: `modules.${moduleIndex}.lessons`,
  });

  return (
    <Card className="relative mb-6">
      <Button type="button" onClick={() => removeModule(moduleIndex)} variant="ghost" size="icon" className="absolute top-2 right-2"><XCircle className="h-5 w-5" /></Button>
      <CardHeader>
        <FormField control={control} name={`modules.${moduleIndex}.name`} render={({ field }) => ( <FormItem><FormLabel>Module Name</FormLabel><FormControl><Input placeholder="Module Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={control} name={`modules.${moduleIndex}.description`} render={({ field }) => ( <FormItem><FormLabel>Module Description</FormLabel><FormControl><Textarea placeholder="Module Description" {...field} /></FormControl><FormMessage /></FormItem> )} />
      </CardHeader>
      <CardContent>
        <h4 className="text-lg font-semibold mb-2">Lessons</h4>
        {lessonFields.map((lesson, lessonIndex) => (
          <div key={lesson.id} className="space-y-2 border p-4 rounded relative mb-4">
            <Button type="button" onClick={() => remove(lessonIndex)} variant="ghost" size="icon" className="absolute top-2 right-2"><XCircle className="h-4 w-4" /></Button>
            <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`} render={({ field }) => ( <FormItem><FormLabel>Lesson Title</FormLabel><FormControl><Input placeholder="Lesson Title" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.content`} render={({ field }) => ( <FormItem><FormLabel>Lesson Content</FormLabel><FormControl><Textarea placeholder="Lesson Content" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.materialType`} render={({ field }) => (
              <FormItem><FormLabel>Material Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a material type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Video">Video</SelectItem><SelectItem value="PDF">PDF</SelectItem><SelectItem value="Slide">Slide</SelectItem><SelectItem value="Link">Link</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
          </div>
        ))}
        <Button type="button" onClick={() => append({ title: '', content: '', materialType: 'Video' })} variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Lesson</Button>
      </CardContent>
    </Card>
  );
};

// --- Main EditCourse Component ---
const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useTenantNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [originalModules, setOriginalModules] = useState<ModuleWithLessons[]>([]); // <-- State to hold initial modules for comparison
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control, name: 'modules',
  });

  useEffect(() => {
    // ... Fetching logic remains the same ...
    const fetchData = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const [courseRes, categoriesRes, instructorsRes, allModulesRes] = await Promise.all([
            lmsApiFetch(`/courses/${id}`),
            lmsApiFetch('/categories'),
            lmsApiFetch('/users?role=Staff'),
            lmsApiFetch('/modules'),
          ]);
  
          if (!courseRes.ok) throw new Error('Failed to fetch course data.');
          
          const courseData = await courseRes.json();
          const categoriesData = await categoriesRes.json();
          const instructorsData = await instructorsRes.json();
          const allModulesData: ApiModule[] = await allModulesRes.json();
          
          setCategories(categoriesData);
          setInstructors(instructorsData);
  
          const courseModules = allModulesData.filter(m => m.course.id === parseInt(id, 10));
  
          const modulesWithLessons = await Promise.all(
            courseModules.map(async (module) => {
              const lessonsRes = await lmsApiFetch(`/lessons/modules/${module.id}`);
              const lessons: ApiLesson[] = await lessonsRes.json();
              return { id: module.id, name: module.name, description: module.description, lessons };
            })
          );
          
          // Store the initial state for comparison on submit
          setOriginalModules(modulesWithLessons);

          form.reset({
            title: courseData.title,
            description: courseData.description,
            categoryId: courseData.category.id,
            instructorId: courseData.instructor.id,
            // Provide defaults for fields not in the GET response
            durationDayCount: courseData.durationDayCount || 30, 
            status: courseData.status 
              ? courseData.status.charAt(0).toUpperCase() + courseData.status.slice(1).toLowerCase()
              : 'Pending',
            modules: modulesWithLessons,
          });
  
          setError(null);
        } catch (err: any) {
          setError(err.message); console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
  }, [id, form]);

  const onSubmit = async (data: CourseFormData) => {
    if (!id) return;
    const courseId = parseInt(id, 10);

    try {
        // --- Step 1: Update Core Course Details ---
        await lmsApiFetch(`/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                instructorId: data.instructorId,
                durationDayCount: data.durationDayCount,
                status: data.status,
            }),
        });

        // --- Step 2: Sync Modules and Lessons ---
        const submittedModules = data.modules;
        const submittedModuleIds = submittedModules.filter(m => m.id).map(m => m.id);
        const originalModuleIds = originalModules.map(m => m.id);

        // Deletions: Find modules that were in the original data but not in the submission
        const moduleIdsToDelete = originalModuleIds.filter(originalId => !submittedModuleIds.includes(originalId));
        const deleteModulePromises = moduleIdsToDelete.map(moduleId => 
            lmsApiFetch(`/modules/${moduleId}`, { method: 'DELETE' })
        );

        // Updates and Creations
        const syncModulePromises = submittedModules.map(async (module) => {
            if (module.id) { // --- UPDATE existing module ---
                const moduleId = module.id;
                await lmsApiFetch(`/modules/${moduleId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: module.name, description: module.description }),
                });

                // Sync lessons within this updated module
                const originalModule = originalModules.find(m => m.id === moduleId);
                const originalLessonIds = originalModule?.lessons.map(l => l.id) || [];
                const submittedLessonIds = module.lessons.filter(l => l.id).map(l => l.id);

                const lessonIdsToDelete = originalLessonIds.filter(originalId => !submittedLessonIds.includes(originalId));
                const deleteLessonPromises = lessonIdsToDelete.map(lessonId => 
                    lmsApiFetch(`/lessons/${lessonId}`, { method: 'DELETE' })
                );

                const syncLessonPromises = module.lessons.map(async (lesson) => {
                    if (lesson.id) { // Update lesson
                        return lmsApiFetch(`/lessons/${lesson.id}`, {
                            method: 'PUT', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: lesson.title, content: lesson.content, materialType: lesson.materialType }),
                        });
                    } else { // Create lesson
                        return lmsApiFetch('/lessons', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...lesson, moduleId }),
                        });
                    }
                });

                await Promise.all([...deleteLessonPromises, ...syncLessonPromises]);

            } else { // --- CREATE new module ---
                const moduleRes = await lmsApiFetch('/modules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: module.name, description: module.description, courseId }),
                });
                const newModule = await moduleRes.json();
                const newModuleId = newModule.id;

                // Create all lessons for this new module
                const createLessonPromises = module.lessons.map(lesson => 
                    lmsApiFetch('/lessons', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...lesson, moduleId: newModuleId }),
                    })
                );
                await Promise.all(createLessonPromises);
            }
        });
        
        await Promise.all([...deleteModulePromises, ...syncModulePromises]);

        navigate(`/course/${id}`);

    } catch (err) {
      console.error("Failed to update course:", err);
      setError("An error occurred while saving the course. Please try again.");
    }
  };

  // The JSX part of the component remains the same, but I'll include it for completeness.
  // ...
  if (loading) return ( <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /><p className="ml-2">Loading course...</p></div> );
  if (error) return ( <div className="flex justify-center items-center h-screen"><p>Error: {error}</p></div> );
  
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Course</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Detail Fields */}
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Course Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="categoryId" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map((c) => (<SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="instructorId" render={({ field }) => ( <FormItem><FormLabel>Instructor</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}><FormControl><SelectTrigger><SelectValue placeholder="Select an instructor" /></SelectTrigger></FormControl><SelectContent>{instructors.map((i) => (<SelectItem key={i.id} value={i.id.toString()}>{i.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="durationDayCount" render={({ field }) => ( <FormItem><FormLabel>Duration (Days)</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Published">Published</SelectItem><SelectItem value="Unpublished">Unpublished</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            </div>

          {/* Modules Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Modules</h3>
              <Button type="button" onClick={() => appendModule({ name: '', description: '', lessons: [{ title: '', content: '', materialType: 'Video' }] })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
              </Button>
            </div>
            {moduleFields.map((field, index) => (
              <ModuleForm key={field.id} moduleIndex={index} control={form.control} removeModule={removeModule} />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/course/${id}`)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCourse;