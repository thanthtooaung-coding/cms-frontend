import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui/components/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@cms/ui/components/dialog';
import { Input } from '@cms/ui/components/input';
import { Textarea } from '@cms/ui/components/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@cms/ui/components/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cms/ui/components/select';
import { PlusCircle, Trash2, Edit, MoreVertical, X, Loader2, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@cms/ui/components/dropdown-menu';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { Label } from '@cms/ui/components/label';


// Data Schemas
interface Course {
  id: number;
  title: string;
  description: string;
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
interface Module { id: number; name: string; course: { id: number; }; }
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
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz/${initialData.id}`);
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
        const endpoint = initialData ? `${import.meta.env.VITE_API_BASE_URL}/quiz/${initialData.id}` : `${import.meta.env.VITE_API_BASE_URL}/quiz`;
        const method = initialData ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
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
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isQuizDialogOpen, setQuizDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [courseRes, allModulesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/${id}`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`),
      ]);

      if (!courseRes.ok) throw new Error('Failed to fetch course');
      if (!allModulesRes.ok) throw new Error('Failed to fetch modules');

      const courseData = await courseRes.json();
      const allModulesData = await allModulesRes.json();
      
      const courseModules = allModulesData.filter((m: Module) => m.course.id === parseInt(id, 10));

      const lessonPromises = courseModules.map((m: Module) =>
            fetch(`${import.meta.env.VITE_API_BASE_URL}/lessons/modules/${m.id}`).then(res => res.ok ? res.json() : [])
        );
        const lessonsByModule = await Promise.all(lessonPromises);
        const allLessons = lessonsByModule.flat();

      const quizPromises = courseModules.map((m: Module) =>
        fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz/modules/${m.id}`).then(res => res.ok ? res.json() : [])
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
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz`, {
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

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading course details...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p>Error: {error}</p></div>;
  if (!course) return <div className="flex justify-center items-center h-screen"><p>Course not found.</p></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-1">{course.description}</CardDescription>
                    </div>
                    <Link to={`/course/${id}/edit`}><Button variant="outline">Edit Course</Button></Link>
                </div>
                 <div className="flex items-center gap-4 pt-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">CATEGORY</h3>
                        <Badge variant="secondary">{course.category.name}</Badge>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">INSTRUCTOR</h3>
                        <p className="text-md font-medium">{course.instructor.name}</p>
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
                <div className="space-y-4">
                    {modules.length > 0 ? modules.map(module => {
                        const moduleLessons = lessons.filter(lesson => lesson.module.id === module.id);
                        return (
                            <Card key={module.id}>
                                <CardHeader><CardTitle>{module.name}</CardTitle></CardHeader>
                                {moduleLessons.length > 0 && (
                                    <CardContent>
                                        <div className="space-y-2 pl-4 border-l-2">
                                            {moduleLessons.map(lesson => (
                                                <div key={lesson.id} className="flex items-center"><p>{lesson.title}</p></div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )
                    }) : <p>No modules found for this course.</p>}
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
    </div>
  );
};

export default CourseDetail;
