import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTenantUrl, useTenantNavigate } from '../../../hooks/useTenantNavigate';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { lmsApiFetch } from '../../../utils/apiClient';
import { Header } from '../../../components/Layout/Header';
import { Main } from '../../../components/Layout/main';
import { ProfileDropdown } from '../../../components/profile-dropdown';
import { Search } from '../../../components/search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui/components/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@cms/ui/components/dialog';
import { Input } from '@cms/ui/components/input';
import { Textarea } from '@cms/ui/components/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@cms/ui/components/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cms/ui/components/select';
import { PlusCircle, Trash2, Edit, MoreVertical, X, Loader2, Sparkles, ArrowLeft, BookOpen, FileText, Video, File, Link as LinkIcon, Presentation } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@cms/ui/components/dropdown-menu';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { Label } from '@cms/ui/components/label';


// Data Schemas
interface Course {
  id: number;
  title: string;
  description: string;
  status?: string;
  category: { id: number; name: string; description: string; };
  instructor: { id: number; name: string; email: string; };
}
// Add detailed interfaces for the quiz structure from your API
interface Answer {
  id: number;
  answerText: string;
  correct: boolean;
}

interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}
interface Module { id: number; name: string; description?: string; course: { id: number; }; }
// Update the Quiz interface to include optional questions
interface Quiz {
  id: number;
  title: string;
  moduleId: number;
  questions?: Question[];
}
interface Lesson {
  id: number;
  title: string;
  content?: string;
  materialType: 'Video' | 'PDF' | 'Slide' | 'Link';
  module: {
    id: number;
  };
}

// Zod Validation Schemas for Quiz Form
const answerOptionSchema = z.object({
  answer: z.string().min(1, 'Answer text is required.'),
  correct: z.boolean(),
});

const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required.'),
  answerOptions: z.array(answerOptionSchema).min(2, 'At least two answer options are required.'),
});

const quizFormSchema = z.object({
  title: z.string().min(1, 'Quiz title is required.'),
  moduleId: z.string().min(1, 'You must select a module.'),
  questions: z.array(questionSchema).min(1, 'At least one question is required.'),
});

type QuizFormData = z.infer<typeof quizFormSchema>;

// Quiz CRUD Dialog Component
const QuizCrudDialog = ({ courseModules, onSave, open, setOpen, initialData }: { courseModules: Module[], onSave: () => void, open: boolean, setOpen: (open: boolean) => void, initialData?: Quiz | null }) => {
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<QuizFormData>({
        resolver: zodResolver(quizFormSchema),
        defaultValues: {
            title: '',
            moduleId: '',
            questions: [],
        },
    });

    const { fields: questions, append: appendQuestion, remove: removeQuestion, replace: replaceQuestions } = useFieldArray({
        control: form.control,
        name: 'questions',
    });

    useEffect(() => {
        const fetchAndSetQuizData = async () => {
            if (initialData) {
                try {
                    const response = await lmsApiFetch(`/quiz/${initialData.id}`);
                    if (!response.ok) throw new Error('Failed to fetch quiz details for editing.');
                    const quizData: Quiz = await response.json();

                    const formValues = {
                        title: quizData.title,
                        moduleId: String(quizData.moduleId),
                        questions: quizData.questions?.map(q => ({
                            question: q.questionText,
                            answerOptions: q.answers.map(a => ({
                                answer: a.answerText,
                                correct: a.correct,
                            })),
                        })) || [],
                    };
                    form.reset(formValues);
                } catch (error) {
                    console.error("Failed to load quiz for editing:", error);
                }
            } else {
                form.reset({
                    title: '',
                    moduleId: '',
                    questions: [],
                });
            }
        };

        if (open) {
            fetchAndSetQuizData();
        }
    }, [initialData, open, form]);

    const handleGenerateQuestions = async () => {
        if (!aiTopic) return;
        setIsGenerating(true);
        try {
            const response = await fetch(`http://localhost:4001/ai-service/generate-quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: aiTopic,
                    num_questions: 4, // You can make this number configurable in the UI
                    difficulty: 'beginner'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate questions from AI service.');
            }

            const aiQuestions = await response.json();

            const formattedQuestions = aiQuestions.map((q: any) => ({
                question: q.question,
                answerOptions: q.answer_options.map((opt: any) => ({
                    answer: opt.answer,
                    correct: opt.correct,
                })),
            }));
            
            // --- FIX: Use appendQuestion to add new questions instead of replacing them ---
            appendQuestion(formattedQuestions);

        } catch (error) {
            console.error("AI Generation Error:", error);
            // Consider showing a toast notification to the user here
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data: QuizFormData) => {
        const apiPayload = { ...data, moduleId: parseInt(data.moduleId, 10) };
        const endpoint = initialData ? `/quiz/${initialData.id}` : '/quiz';
        const method = initialData ? 'PUT' : 'POST';

        try {
            const response = await lmsApiFetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });
            if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} quiz.`);
            onSave();
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Quiz' : 'Create a New Quiz'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Quiz Title</FormLabel><FormControl><Input placeholder="e.g., Java Basics Quiz" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="moduleId" render={({ field }) => (
                                <FormItem><FormLabel>Module</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Select a module" /></SelectTrigger>
                                        <SelectContent>{courseModules.map(m => (<SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        
                        {/* --- AI Generation Section --- */}
                        <div className="space-y-2 rounded-lg border bg-slate-50 p-4">
                            <Label htmlFor="ai-topic" className="font-semibold">Generate Questions with AI</Label>
                            <div className="flex flex-col sm:flex-row items-end gap-2">
                                <div className="w-full">
                                    <Input
                                        id="ai-topic"
                                        placeholder="Enter a topic, e.g., 'The basics of Photosynthesis'"
                                        value={aiTopic}
                                        onChange={(e) => setAiTopic(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={handleGenerateQuestions} disabled={!aiTopic || isGenerating} className="w-full sm:w-auto flex-shrink-0">
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Questions</h3>
                            {questions.map((question, qIndex) => (
                                <Card key={question.id} className="mb-4 p-4 relative">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeQuestion(qIndex)}><X className="h-4 w-4" /></Button>
                                    <FormField control={form.control} name={`questions.${qIndex}.question`} render={({ field }) => (
                                        <FormItem><FormLabel>Question {qIndex + 1}</FormLabel><FormControl><Textarea placeholder="What is..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <AnswerOptions form={form} questionIndex={qIndex} />
                                </Card>
                            ))}
                            <Button type="button" variant="outline" onClick={() => appendQuestion({ question: '', answerOptions: [{ answer: '', correct: true }, { answer: '', correct: false }] })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Question Manually
                            </Button>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? 'Save Changes' : 'Create Quiz'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const AnswerOptions = ({ form, questionIndex }: { form: any, questionIndex: number }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `questions.${questionIndex}.answerOptions`,
    });

    return (
        <div className="mt-4 pl-4 border-l-2">
            <h4 className="text-md font-semibold mb-2">Answer Options</h4>
            {fields.map((answer, aIndex) => (
                <div key={answer.id} className="flex items-center gap-2 mb-2">
                    <Controller
                        control={form.control}
                        name={`questions.${questionIndex}.answerOptions.${aIndex}.correct`}
                        render={({ field }) => (
                             <input
                                type="radio"
                                ref={field.ref}
                                onBlur={field.onBlur}
                                name={`questions.${questionIndex}.correctAnswer`}
                                checked={field.value}
                                onChange={() => {
                                    const options = form.getValues(`questions.${questionIndex}.answerOptions`);
                                    options.forEach((_, i) => {
                                        form.setValue(`questions.${questionIndex}.answerOptions.${i}.correct`, false, { shouldValidate: true, shouldDirty: true });
                                    });
                                    form.setValue(`questions.${questionIndex}.answerOptions.${aIndex}.correct`, true, { shouldValidate: true, shouldDirty: true });
                                }}
                             />
                        )}
                    />
                    <FormField control={form.control} name={`questions.${questionIndex}.answerOptions.${aIndex}.answer`} render={({ field }) => (
                        <FormItem className="flex-grow"><FormControl><Input placeholder={`Answer ${aIndex + 1}`} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(aIndex)} disabled={fields.length <= 2}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => append({ answer: '', correct: false })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
            </Button>
        </div>
    );
};


// Main Course Detail Component
const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const getTenantUrl = useTenantUrl();
  const navigate = useTenantNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isQuizDialogOpen, setQuizDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false);
  const [selectedModuleForDelete, setSelectedModuleForDelete] = useState<Module | null>(null);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
  const [selectedLessonForDelete, setSelectedLessonForDelete] = useState<Lesson | null>(null);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleEditName, setModuleEditName] = useState('');
  const [moduleEditDescription, setModuleEditDescription] = useState('');
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isUpdatingModule, setIsUpdatingModule] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonEditTitle, setLessonEditTitle] = useState('');
  const [lessonEditContent, setLessonEditContent] = useState('');
  const [lessonEditMaterialType, setLessonEditMaterialType] = useState<'Video' | 'PDF' | 'Slide' | 'Link'>('Video');
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isUpdatingLesson, setIsUpdatingLesson] = useState(false);
  const [isAddModuleDialogOpen, setIsAddModuleDialogOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState<Module | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonMaterialType, setNewLessonMaterialType] = useState<'Video' | 'PDF' | 'Slide' | 'Link'>('Video');
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [courseRes, allModulesRes] = await Promise.all([
        lmsApiFetch(`/courses/${id}`),
        lmsApiFetch('/modules'),
      ]);

      if (!courseRes.ok) throw new Error('Failed to fetch course');
      if (!allModulesRes.ok) throw new Error('Failed to fetch modules');

      const courseData = await courseRes.json();
      const allModulesData = await allModulesRes.json();
      
      const courseModules = allModulesData.filter((m: Module) => m.course.id === parseInt(id, 10));

      const lessonPromises = courseModules.map((m: Module) =>
            lmsApiFetch(`/lessons/modules/${m.id}`).then(res => res.ok ? res.json() : [])
        );
        const lessonsByModule = await Promise.all(lessonPromises);
        const allLessons = lessonsByModule.flat();

      const quizPromises = courseModules.map((m: Module) =>
        lmsApiFetch(`/quiz/modules/${m.id}`).then(res => res.ok ? res.json() : [])
      );
      const quizzesByModule = await Promise.all(quizPromises);
      const allQuizzes = quizzesByModule.flat();

      setCourse(courseData);
      setModules(courseModules);
      setLessons(allLessons);
      setQuizzes(allQuizzes);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenCreateQuiz = () => {
    setSelectedQuiz(null);
    setQuizDialogOpen(true);
  };

  const handleOpenEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizDialogOpen(true);
  };

  const handleOpenDeleteQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setDeleteDialogOpen(true);
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;
    try {
        await lmsApiFetch('/quiz', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [selectedQuiz.id] }),
        });
        fetchData();
    } catch (error) {
        console.error("Failed to delete quiz", error);
    } finally {
        setDeleteDialogOpen(false);
        setSelectedQuiz(null);
    }
  };

  const handleOpenModuleEdit = (module: Module) => {
    setEditingModule(module);
    setModuleEditName(module.name);
    setModuleEditDescription(module.description || '');
    setIsModuleDialogOpen(true);
  };

  const handleCloseModuleEdit = () => {
    setIsModuleDialogOpen(false);
    setEditingModule(null);
    setModuleEditName('');
    setModuleEditDescription('');
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    
    try {
      setIsUpdatingModule(true);
      const response = await lmsApiFetch(`/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: moduleEditName,
          description: moduleEditDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update module');
      }

      // Refresh the data
      await fetchData();
      handleCloseModuleEdit();
    } catch (err: any) {
      console.error('Failed to update module:', err);
      alert('Failed to update module. Please try again.');
    } finally {
      setIsUpdatingModule(false);
    }
  };

  const handleOpenLessonEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonEditTitle(lesson.title);
    setLessonEditContent(lesson.content || '');
    setLessonEditMaterialType(lesson.materialType);
    setIsLessonDialogOpen(true);
  };

  const handleCloseLessonEdit = () => {
    setIsLessonDialogOpen(false);
    setEditingLesson(null);
    setLessonEditTitle('');
    setLessonEditContent('');
    setLessonEditMaterialType('Video');
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    
    try {
      setIsUpdatingLesson(true);
      const response = await lmsApiFetch(`/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lessonEditTitle,
          content: lessonEditContent,
          materialType: lessonEditMaterialType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }

      // Refresh the data
      await fetchData();
      handleCloseLessonEdit();
    } catch (err: any) {
      console.error('Failed to update lesson:', err);
      alert('Failed to update lesson. Please try again.');
    } finally {
      setIsUpdatingLesson(false);
    }
  };

  const handleOpenAddModule = () => {
    setNewModuleName('');
    setNewModuleDescription('');
    setIsAddModuleDialogOpen(true);
  };

  const handleCloseAddModule = () => {
    setIsAddModuleDialogOpen(false);
    setNewModuleName('');
    setNewModuleDescription('');
  };

  const handleCreateModule = async () => {
    if (!id || !newModuleName.trim()) return;
    
    try {
      setIsCreatingModule(true);
      const response = await lmsApiFetch('/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newModuleName,
          description: newModuleDescription,
          courseId: parseInt(id, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      // Refresh the data
      await fetchData();
      handleCloseAddModule();
    } catch (err: any) {
      console.error('Failed to create module:', err);
      alert('Failed to create module. Please try again.');
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleOpenAddLesson = (module: Module) => {
    setSelectedModuleForLesson(module);
    setNewLessonTitle('');
    setNewLessonContent('');
    setNewLessonMaterialType('Video');
    setIsAddLessonDialogOpen(true);
  };

  const handleCloseAddLesson = () => {
    setIsAddLessonDialogOpen(false);
    setSelectedModuleForLesson(null);
    setNewLessonTitle('');
    setNewLessonContent('');
    setNewLessonMaterialType('Video');
  };

  const handleCreateLesson = async () => {
    if (!selectedModuleForLesson || !newLessonTitle.trim()) return;
    
    try {
      setIsCreatingLesson(true);
      const response = await lmsApiFetch('/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLessonTitle,
          content: newLessonContent,
          materialType: newLessonMaterialType,
          moduleId: selectedModuleForLesson.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      // Refresh the data
      await fetchData();
      handleCloseAddLesson();
    } catch (err: any) {
      console.error('Failed to create lesson:', err);
      alert('Failed to create lesson. Please try again.');
    } finally {
      setIsCreatingLesson(false);
    }
  };

  const handleOpenDeleteModule = (module: Module) => {
    setSelectedModuleForDelete(module);
    setIsDeleteModuleDialogOpen(true);
  };

  const handleDeleteModule = async () => {
    if (!selectedModuleForDelete) return;
    
    try {
      setIsDeletingModule(true);
      const response = await lmsApiFetch(`/modules/${selectedModuleForDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      // Refresh the data
      await fetchData();
      setIsDeleteModuleDialogOpen(false);
      setSelectedModuleForDelete(null);
    } catch (err: any) {
      console.error('Failed to delete module:', err);
      alert('Failed to delete module. Please try again.');
    } finally {
      setIsDeletingModule(false);
    }
  };

  const handleOpenDeleteLesson = (lesson: Lesson) => {
    setSelectedLessonForDelete(lesson);
    setIsDeleteLessonDialogOpen(true);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLessonForDelete) return;
    
    try {
      setIsDeletingLesson(true);
      const response = await lmsApiFetch(`/lessons/${selectedLessonForDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      // Refresh the data
      await fetchData();
      setIsDeleteLessonDialogOpen(false);
      setSelectedLessonForDelete(null);
    } catch (err: any) {
      console.error('Failed to delete lesson:', err);
      alert('Failed to delete lesson. Please try again.');
    } finally {
      setIsDeletingLesson(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <p>Loading course details...</p>
          </div>
        </Main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <p>Error: {error}</p>
          </div>
        </Main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex justify-center items-center h-screen">
            <p>Course not found.</p>
          </div>
        </Main>
      </>
    );
  }

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6 -mt-2">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/course')}
                    className="flex items-center gap-2 h-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                </Button>
            </div>
            <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-1">{course.description}</CardDescription>
                    </div>
                    <Link to={getTenantUrl(`/course/${id}/edit`)}><Button variant="outline">Edit Course</Button></Link>
                </div>
                 <div className="flex items-center gap-4 pt-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">CATEGORY</h3>
                        <Badge variant="secondary">{course.category.name}</Badge>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">INSTRUCTOR</h3>
                        <Link 
                            to={getTenantUrl(`/instructor/${course.instructor.id}`)}
                            className="text-md font-medium hover:text-purple-600 transition-colors"
                        >
                            {course.instructor.name}
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">STATUS</h3>
                        {(() => {
                            const status = course.status?.toLowerCase() || 'pending';
                            const statusConfig = {
                                published: {
                                    bg: 'bg-green-100',
                                    text: 'text-green-800',
                                    border: 'border-green-300',
                                    dot: 'bg-green-500',
                                    label: 'Published'
                                },
                                unpublished: {
                                    bg: 'bg-amber-100',
                                    text: 'text-amber-800',
                                    border: 'border-amber-300',
                                    dot: 'bg-amber-500',
                                    label: 'Unpublished'
                                },
                                archived: {
                                    bg: 'bg-slate-100',
                                    text: 'text-slate-800',
                                    border: 'border-slate-300',
                                    dot: 'bg-slate-500',
                                    label: 'Archived'
                                },
                                pending: {
                                    bg: 'bg-indigo-100',
                                    text: 'text-indigo-800',
                                    border: 'border-indigo-300',
                                    dot: 'bg-indigo-500',
                                    label: 'Pending'
                                }
                            };
                            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                            return (
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${config.bg} ${config.text} ${config.border}`}>
                                    <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
                                    <span className="text-sm font-semibold">{config.label}</span>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </CardHeader>
        </Card>

        <Tabs defaultValue="content">
            <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Course Content</h2>
                    <Button onClick={handleOpenAddModule} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Module
                    </Button>
                </div>
                <div className="space-y-6">
                    {modules.length > 0 ? modules.map((module, moduleIndex) => {
                        const moduleLessons = lessons.filter(lesson => lesson.module.id === module.id);
                        return (
                            <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow !py-0">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-b !p-0 !m-0 !px-0 w-full rounded-t-xl">
                                    <div className="p-6 w-full">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                            Module {moduleIndex + 1}: {module.name}
                                                        </CardTitle>
                                                        {module.description && (
                                                            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {module.description}
                                                            </CardDescription>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenModuleEdit(module)}
                                                            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenDeleteModule(module)}
                                                            className="flex items-center gap-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {moduleLessons.length} {moduleLessons.length === 1 ? 'lesson' : 'lessons'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Lessons</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenAddLesson(module)}
                                            className="flex items-center gap-1.5"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Lesson
                                        </Button>
                                    </div>
                                    {moduleLessons.length > 0 ? (
                                        <div className="space-y-3">
                                            {moduleLessons.map((lesson, lessonIndex) => {
                                                const getMaterialIcon = () => {
                                                    switch (lesson.materialType) {
                                                        case 'Video':
                                                            return <Video className="h-4 w-4 text-red-500" />;
                                                        case 'PDF':
                                                            return <FileText className="h-4 w-4 text-blue-500" />;
                                                        case 'Slide':
                                                            return <Presentation className="h-4 w-4 text-orange-500" />;
                                                        case 'Link':
                                                            return <LinkIcon className="h-4 w-4 text-green-500" />;
                                                        default:
                                                            return <File className="h-4 w-4 text-gray-500" />;
                                                    }
                                                };

                                                const getMaterialBadgeColor = () => {
                                                    switch (lesson.materialType) {
                                                        case 'Video':
                                                            return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
                                                        case 'PDF':
                                                            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
                                                        case 'Slide':
                                                            return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
                                                        case 'Link':
                                                            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
                                                        default:
                                                            return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
                                                    }
                                                };

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-colors group"
                                                    >
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                                                {getMaterialIcon()}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                                            Lesson {lessonIndex + 1}
                                                                        </span>
                                                                        <Badge 
                                                                            variant="outline" 
                                                                            className={`text-xs font-medium ${getMaterialBadgeColor()}`}
                                                                        >
                                                                            {lesson.materialType}
                                                                        </Badge>
                                                                    </div>
                                                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                                        {lesson.title}
                                                                    </h4>
                                                                    {lesson.content && (
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                            {lesson.content}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenLessonEdit(lesson)}
                                                                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 h-7 w-7 p-0"
                                                                    >
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenDeleteLesson(lesson)}
                                                                        className="flex items-center gap-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100 h-7 w-7 p-0"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm mb-3">No lessons in this module yet</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenAddLesson(module)}
                                                className="flex items-center gap-1.5 mx-auto"
                                            >
                                                <PlusCircle className="h-4 w-4" />
                                                Add First Lesson
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    }) : (
                        <Card>
                            <CardContent className="p-12">
                                <div className="text-center">
                                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Modules Found</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">This course doesn't have any modules yet.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="quizzes" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Manage Quizzes</h2>
                    <Button onClick={handleOpenCreateQuiz}><PlusCircle className="mr-2 h-4 w-4" /> Create Quiz</Button>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {quizzes.length > 0 ? quizzes.map(quiz => (
                                <div key={quiz.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{quiz.title}</p>
                                        <p className="text-sm text-gray-500">Module: {modules.find(m => m.id === quiz.moduleId)?.name || 'N/A'}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenEditQuiz(quiz)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOpenDeleteQuiz(quiz)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )) : <p className="p-4 text-center text-gray-500">No quizzes created yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {isQuizDialogOpen && <QuizCrudDialog courseModules={modules} onSave={fetchData} open={isQuizDialogOpen} setOpen={setQuizDialogOpen} initialData={selectedQuiz} />}
        
        {selectedQuiz && <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Are you sure?"
            desc={`This will permanently delete the quiz "${selectedQuiz.title}". This action cannot be undone.`}
            handleConfirm={handleDeleteQuiz}
            destructive
        />}

        {selectedModuleForDelete && (
            <ConfirmDialog
                open={isDeleteModuleDialogOpen}
                onOpenChange={setIsDeleteModuleDialogOpen}
                title="Delete Module"
                desc={`This will permanently delete the module "${selectedModuleForDelete.name}" and all its lessons. This action cannot be undone.`}
                handleConfirm={handleDeleteModule}
                destructive
            />
        )}

        {selectedLessonForDelete && (
            <ConfirmDialog
                open={isDeleteLessonDialogOpen}
                onOpenChange={setIsDeleteLessonDialogOpen}
                title="Delete Lesson"
                desc={`This will permanently delete the lesson "${selectedLessonForDelete.title}". This action cannot be undone.`}
                handleConfirm={handleDeleteLesson}
                destructive
            />
        )}

        {/* Module Edit Dialog */}
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={moduleEditName}
                  onChange={(e) => setModuleEditName(e.target.value)}
                  placeholder="Enter module name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-description">Module Description</Label>
                <Textarea
                  id="module-description"
                  value={moduleEditDescription}
                  onChange={(e) => setModuleEditDescription(e.target.value)}
                  placeholder="Enter module description"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseModuleEdit}
                disabled={isUpdatingModule}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateModule}
                disabled={isUpdatingModule || !moduleEditName.trim()}
              >
                {isUpdatingModule && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Module Dialog */}
        <Dialog open={isAddModuleDialogOpen} onOpenChange={setIsAddModuleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-module-name">Module Name</Label>
                <Input
                  id="new-module-name"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  placeholder="Enter module name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-module-description">Module Description</Label>
                <Textarea
                  id="new-module-description"
                  value={newModuleDescription}
                  onChange={(e) => setNewModuleDescription(e.target.value)}
                  placeholder="Enter module description"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseAddModule}
                disabled={isCreatingModule}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateModule}
                disabled={isCreatingModule || !newModuleName.trim()}
              >
                {isCreatingModule && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Lesson Dialog */}
        <Dialog open={isAddLessonDialogOpen} onOpenChange={setIsAddLessonDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              {selectedModuleForLesson && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Module: {selectedModuleForLesson.name}
                </p>
              )}
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-lesson-title">Lesson Title</Label>
                <Input
                  id="new-lesson-title"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Enter lesson title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-lesson-content">Lesson Content</Label>
                <Textarea
                  id="new-lesson-content"
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  placeholder="Enter lesson content or URL"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-lesson-material-type">Material Type</Label>
                <Select
                  value={newLessonMaterialType}
                  onValueChange={(value: 'Video' | 'PDF' | 'Slide' | 'Link') => setNewLessonMaterialType(value)}
                >
                  <SelectTrigger id="new-lesson-material-type">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Slide">Slide</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseAddLesson}
                disabled={isCreatingLesson}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateLesson}
                disabled={isCreatingLesson || !newLessonTitle.trim()}
              >
                {isCreatingLesson && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Lesson
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson Edit Dialog */}
        <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Lesson Title</Label>
                <Input
                  id="lesson-title"
                  value={lessonEditTitle}
                  onChange={(e) => setLessonEditTitle(e.target.value)}
                  placeholder="Enter lesson title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-content">Lesson Content</Label>
                <Textarea
                  id="lesson-content"
                  value={lessonEditContent}
                  onChange={(e) => setLessonEditContent(e.target.value)}
                  placeholder="Enter lesson content or URL"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-material-type">Material Type</Label>
                <Select
                  value={lessonEditMaterialType}
                  onValueChange={(value: 'Video' | 'PDF' | 'Slide' | 'Link') => setLessonEditMaterialType(value)}
                >
                  <SelectTrigger id="lesson-material-type">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Slide">Slide</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseLessonEdit}
                disabled={isUpdatingLesson}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateLesson}
                disabled={isUpdatingLesson || !lessonEditTitle.trim()}
              >
                {isUpdatingLesson && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </Main>
    </>
  );
};

export default CourseDetail;
