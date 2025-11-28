import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@cms/ui/components/accordion';
import { Button } from '@cms/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@cms/ui/components/card';
import { PlayCircle, CheckCircle2, XCircle, Loader2, ArrowLeft, FileText, File, Video, Presentation, Link as LinkIcon, RotateCcw, History, Trash2 } from 'lucide-react';
import { lmsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';

interface Lesson {
  id: number;
  title: string;
  content: string;
  materialType: string;
}

interface Quiz {
  id: number;
  title: string;
}

interface Module {
  id: number;
  name: string;
  description: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

interface CourseLessonData {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  modules: Module[];
}

interface QuizQuestion {
  id: number;
  questionText: string;
  answers: Array<{
    id: number;
    answerText: string;
    correct: boolean;
  }>;
}

interface QuizData {
  id: number;
  title: string;
  moduleId: number;
  questions: QuizQuestion[];
}

const CourseLesson = () => {
  const { id, tenantSlug } = useParams<{ id: string; tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthDataStore();
  const [courseData, setCourseData] = useState<CourseLessonData | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<any>(null);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [lastSubmissionWithAnswers, setLastSubmissionWithAnswers] = useState<any>(null);
  const [viewingLastSubmission, setViewingLastSubmission] = useState(false);
  const [isDeletingSubmissions, setIsDeletingSubmissions] = useState(false);
  const [isEligibleForCertificate, setIsEligibleForCertificate] = useState<boolean | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [hasLastSubmission, setHasLastSubmission] = useState<boolean>(false);

  // Convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return url;

    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    let videoId = '';

    // Handle different YouTube URL formats
    // Format: https://youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) {
        videoId = match[1].split('?')[0]; // Remove query params
      }
    }
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    else if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match) {
        videoId = match[1];
      }
    }
    // Format: https://youtube.com/watch?v=VIDEO_ID
    else if (url.includes('youtube.com/')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match) {
        videoId = match[1];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If not a YouTube URL, return as-is (for other video platforms or direct links)
    return url;
  };

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await lmsApiFetch(`/courses/${id}/lesson-content`, {
          method: 'GET',
        }, false);

        if (!response.ok) {
          throw new Error('Failed to load course content');
        }

        const data = await response.json();
        setCourseData(data);

        // Check certificate eligibility if user is logged in
        if (user && id) {
          checkCertificateEligibility(parseInt(id, 10));
        }

        // Select first lesson if available and expand its module
        if (data.modules && data.modules.length > 0) {
          const firstModule = data.modules[0];
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            setSelectedLesson(firstModule.lessons[0]);
            setOpenModule(`module-${firstModule.id}`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course content');
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, user]);

  const loadQuiz = async (quizId: number) => {
    try {
      const response = await lmsApiFetch(`/quiz/${quizId}`, {
        method: 'GET',
      }, false);

      if (!response.ok) {
        throw new Error('Failed to load quiz');
      }

      const quizData: QuizData = await response.json();
      setSelectedQuiz(quizData);
      setQuizAnswers({});
      setQuizResults(null);
      setSubmissionHistory(null);
      setViewingHistory(false);
      
      // Check if last submission exists for this quiz
      if (user) {
        checkLastSubmissionExists(quizData.id);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
    }
  };

  const loadQuizForRetake = async (quizId: number) => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiFetch(`/quiz/${quizId}/retake`, {
        method: 'GET',
      }, false);

      if (!response.ok) {
        throw new Error('Failed to load quiz for retake');
      }

      const quizData: QuizData = await response.json();
      setSelectedQuiz(quizData);
      setQuizAnswers({});
      setQuizResults(null);
      setSubmissionHistory(null);
      setViewingHistory(false);
      setLastSubmissionWithAnswers(null);
      setViewingLastSubmission(false);
      
      // Check if last submission exists for this quiz
      if (user) {
        checkLastSubmissionExists(quizData.id);
      }
    } catch (err) {
      console.error('Error loading quiz for retake:', err);
      setError('Failed to load quiz for retake');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissionHistory = async (quizId: number) => {
    console.log('loadSubmissionHistory', quizId);
    console.log('user', user);
    console.log('selectedQuiz', selectedQuiz);
    console.log('quizAnswers', quizAnswers);
    console.log('quizResults', quizResults);
    console.log('submissionHistory', submissionHistory);
    console.log('viewingHistory', viewingHistory);
    console.log('lastSubmissionWithAnswers', lastSubmissionWithAnswers);
    console.log('viewingLastSubmission', viewingLastSubmission);
    if (!user) return;
    try {
      setLoading(true);
      const response = await lmsApiFetch(`/quiz/${quizId}/submission-history`, {
        method: 'GET',
      }, false);

      if (!response.ok) {
        throw new Error('Failed to load submission history');
      }

      const history = await response.json();
      setSubmissionHistory(history);
      setViewingHistory(true);
      // Don't clear quizResults - keep it for "Back to Results" navigation
      setLastSubmissionWithAnswers(null);
      setViewingLastSubmission(false);
    } catch (err) {
      console.error('Error loading submission history:', err);
      setError('Failed to load submission history');
    } finally {
      setLoading(false);
    }
  };

  const checkLastSubmissionExists = async (quizId: number) => {
    if (!user) {
      setHasLastSubmission(false);
      return;
    }
    try {
      const response = await lmsApiFetch(`/quiz/${quizId}/last-submission`, {
        method: 'GET',
      }, false);

      if (response.status === 404) {
        setHasLastSubmission(false);
        return;
      }

      if (!response.ok) {
        setHasLastSubmission(false);
        return;
      }

      setHasLastSubmission(true);
    } catch (err) {
      console.error('Error checking last submission:', err);
      setHasLastSubmission(false);
    }
  };

  const loadLastSubmissionWithAnswers = async (quizId: number) => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiFetch(`/quiz/${quizId}/last-submission`, {
        method: 'GET',
      }, false);

      if (!response.ok) {
        if (response.status === 404) {
          setError('No previous submission found');
          setHasLastSubmission(false);
          return;
        }
        throw new Error('Failed to load last submission');
      }

      const submission = await response.json();
      setLastSubmissionWithAnswers(submission);
      setViewingLastSubmission(true);
      setHasLastSubmission(true);
      // Don't clear quizResults - we want to keep it for "Back" navigation
      setSubmissionHistory(null);
      setViewingHistory(false);
    } catch (err) {
      console.error('Error loading last submission:', err);
      setError('Failed to load last submission');
      setHasLastSubmission(false);
    } finally {
      setLoading(false);
    }
  };

  const checkCertificateEligibility = async (courseId: number) => {
    if (!user) return;
    
    try {
      setCheckingEligibility(true);
      const response = await lmsApiFetch(`/certificates/student/${user.id}/course/${courseId}/eligible`, {
        method: 'GET',
      }, false);

      if (!response.ok) {
        throw new Error('Failed to check certificate eligibility');
      }

      const eligible = await response.json();
      // Handle both boolean and string responses
      const isEligible = eligible === true || eligible === 'true' || eligible === 1;
      console.log('Certificate eligibility check:', { eligible, isEligible, courseId });
      setIsEligibleForCertificate(isEligible);
    } catch (err) {
      console.error('Error checking certificate eligibility:', err);
      setIsEligibleForCertificate(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleDeleteAllSubmissionsExceptLatest = async (quizId: number) => {
    if (!user || !selectedQuiz) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete all previous submissions except the latest one? ' +
      'This will help you get the correct answers for certificate eligibility. ' +
      'This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      setIsDeletingSubmissions(true);
      setError(null);
      
      const response = await lmsApiFetch(`/quiz/${quizId}/submissions/keep-latest`, {
        method: 'DELETE',
      }, false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete submissions' }));
        throw new Error(errorData.message || 'Failed to delete submissions');
      }

      // Reload the quiz to get fresh data
      await loadQuiz(quizId);
      alert('Successfully deleted all previous submissions. Only the latest submission remains.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submissions');
      console.error('Error deleting submissions:', err);
    } finally {
      setIsDeletingSubmissions(false);
    }
  };

  const handleQuizAnswerChange = (questionId: number, answerId: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz || !user) {
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const answerSubmissions = Object.entries(quizAnswers).map(([questionId, answerId]) => ({
        questionId: parseInt(questionId, 10),
        answerId: answerId
      }));

      const response = await lmsApiFetch('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          quizId: selectedQuiz.id,
          answers: answerSubmissions
        })
      }, false);

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      setQuizResults(result);
      
      // After submission, there will be a last submission
      setHasLastSubmission(true);
      
      // Check certificate eligibility after quiz submission
      if (user && id) {
        checkCertificateEligibility(parseInt(id, 10));
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => {
              const courseDetailPath = tenantSlug 
                ? `/lms/${tenantSlug}/course/${id}` 
                : `/course/${id}`;
              navigate(courseDetailPath);
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {courseData.courseTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {courseData.courseDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Certificate Eligibility Banner - Full width (main content + sidebar) */}
        {isEligibleForCertificate === true && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-green-900 dark:text-green-100">
                🎓 Certificate Eligible! Your certificate is now available.
              </span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area - Video Player and Quiz */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {selectedLesson && selectedLesson.materialType === 'Video' && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={convertToEmbedUrl(selectedLesson.content)}
                      title={selectedLesson.title}
                      allowFullScreen
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      frameBorder="0"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Material Types (Slides, Links, PDFs, Articles) */}
            {selectedLesson && selectedLesson.materialType !== 'Video' && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLesson.materialType === 'Link' ? (
                    <div className="p-6 text-center">
                      <a
                        href={selectedLesson.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 underline font-medium"
                      >
                        Open Link: {selectedLesson.content}
                      </a>
                    </div>
                  ) : selectedLesson.materialType === 'PDF' ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedLesson.content)}&embedded=true`}
                          title={selectedLesson.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <Button
                          onClick={() => window.open(selectedLesson.content, '_blank')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Open PDF in New Tab
                        </Button>
                        <Button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedLesson.content;
                            link.download = selectedLesson.title + '.pdf';
                            link.target = '_blank';
                            link.click();
                          }}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <File className="w-4 h-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : selectedLesson.materialType === 'Slide' ? (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={selectedLesson.content}
                        title={selectedLesson.title}
                        className="w-full h-full"
                        frameBorder="0"
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="prose max-w-none dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quiz Section */}
            {selectedQuiz && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedQuiz.title}</CardTitle>
                    {!viewingLastSubmission && !viewingHistory && !quizResults && hasLastSubmission && (
                      <Button
                        onClick={() => loadLastSubmissionWithAnswers(selectedQuiz.id)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <History className="w-4 h-4" />
                        View Last Submission
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {viewingLastSubmission && lastSubmissionWithAnswers ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Your Last Submission</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          Score: {lastSubmissionWithAnswers.score} / {lastSubmissionWithAnswers.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Attempt #{lastSubmissionWithAnswers.attempt} • Submitted: {new Date(lastSubmissionWithAnswers.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Percentage: {((lastSubmissionWithAnswers.score / lastSubmissionWithAnswers.totalQuestions) * 100).toFixed(1)}%
                        </p>
                      </div>
                      
                      {/* Information Banner */}
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                              Review Mode
                            </h4>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              To encourage active learning and help you better understand the material, we've hidden which answers are correct or incorrect. Review your responses and use the "Answer Again" button to retake the quiz and see detailed feedback with correct answers.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button
                          onClick={() => {
                            setViewingLastSubmission(false);
                            setLastSubmissionWithAnswers(null);
                            // If we have quizResults, we'll show results, otherwise show quiz questions
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          {quizResults ? 'Back to Results' : 'Back to Quiz'}
                        </Button>
                        <Button
                          onClick={() => loadQuizForRetake(selectedQuiz.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Answer Again
                        </Button>
                      </div>
                      {lastSubmissionWithAnswers.questionResults.map((result: any) => (
                        <div key={result.questionId} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                          <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{result.questionText}</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your answer:</p>
                              <p className="text-gray-900 dark:text-gray-100">{result.selectedAnswerText}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : viewingHistory && submissionHistory ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Previous Submission</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          Score: {submissionHistory.score} / {submissionHistory.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Attempt #{submissionHistory.attempt} • Submitted: {new Date(submissionHistory.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <Button
                          onClick={() => {
                            setViewingHistory(false);
                            setSubmissionHistory(null);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Results
                        </Button>
                        <Button
                          onClick={() => loadLastSubmissionWithAnswers(selectedQuiz.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          <History className="w-4 h-4 mr-2" />
                          View With Answers
                        </Button>
                        <Button
                          onClick={() => loadQuizForRetake(selectedQuiz.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Answer Again
                        </Button>
                      </div>
                      {submissionHistory.questions.map((question: any) => (
                        <div key={question.questionId} className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-3">{question.questionText}</h4>
                          <div className="space-y-2">
                            {question.answerOptions.map((answer: any) => (
                              <div
                                key={answer.answerId}
                                className="p-2 border rounded bg-gray-50 dark:bg-gray-800"
                              >
                                {answer.answerText}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">
                            Note: Answers are hidden to prevent cheating. Click "Answer Again" to retake the quiz.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : quizResults ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Quiz Results</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          Score: {quizResults.score} / {quizResults.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Attempt #{quizResults.attempt}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Percentage: {((quizResults.score / quizResults.totalQuestions) * 100).toFixed(1)}%
                        </p>
                      </div>
                      
                      {/* Certificate Eligibility Banner */}
                      {isEligibleForCertificate === true && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-green-900 dark:text-green-100 text-sm">
                              🎓 Certificate Eligible! Your certificate is now available.
                            </span>
                          </div>
                        </div>
                      )}
                      {isEligibleForCertificate === false && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Keep Learning!
                              </h4>
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                You need to score 75% or higher across all quizzes to earn a certificate. Keep practicing and retake quizzes to improve your score!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {hasLastSubmission && (
                            <Button
                              onClick={() => loadLastSubmissionWithAnswers(selectedQuiz.id)}
                              variant="outline"
                              className="flex-1"
                            >
                              <History className="w-4 h-4 mr-2" />
                              View Last Submission
                            </Button>
                          )}
                          <Button
                            onClick={() => loadQuizForRetake(selectedQuiz.id)}
                            className={hasLastSubmission ? "flex-1 bg-purple-600 hover:bg-purple-700" : "w-full bg-purple-600 hover:bg-purple-700"}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Answer Again
                          </Button>
                        </div>                      
                      </div>
                      {quizResults.questionResults.map((result: any) => (
                        <div key={result.questionId} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{result.questionText}</h4>
                            {result.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Your answer:</span>{' '}
                              <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {result.selectedAnswerText}
                              </span>
                            </p>
                            {!result.isCorrect && (
                              <p>
                                <span className="font-medium">Correct answer:</span>{' '}
                                <span className="text-green-600">{result.correctAnswerText}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {selectedQuiz.questions.map((question) => (
                        <div key={question.id} className="space-y-3">
                          <h3 className="font-semibold text-lg">{question.questionText}</h3>
                          <div className="space-y-2">
                            {question.answers.map((answer) => (
                              <label
                                key={answer.id}
                                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={answer.id}
                                  checked={quizAnswers[question.id] === answer.id}
                                  onChange={() => handleQuizAnswerChange(question.id, answer.id)}
                                  className="w-4 h-4 text-purple-600"
                                />
                                <span>{answer.answerText}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmittingQuiz || Object.keys(quizAnswers).length !== selectedQuiz.questions.length}
                        className="w-full"
                      >
                        {isSubmittingQuiz ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Quiz'
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* No selection message */}
            {!selectedLesson && !selectedQuiz && (
              <Card>
                <CardContent className="py-12 text-center">
                  <PlayCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a lesson or quiz from the sidebar to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Modules, Lessons, and Quizzes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full"
                  value={openModule || undefined}
                  onValueChange={(value) => setOpenModule(value || null)}
                >
                  {courseData.modules.map((module) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger>{module.name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {/* Lessons */}
                          {module.lessons.map((lesson) => {
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

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setSelectedLesson(lesson);
                                  setSelectedQuiz(null);
                                  setQuizResults(null);
                                  // Expand the module containing the selected lesson
                                  setOpenModule(`module-${module.id}`);
                                }}
                                className={`w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 transition-colors ${
                                  selectedLesson?.id === lesson.id 
                                    ? 'bg-purple-100 dark:bg-purple-900/20 border-l-4 border-purple-600 font-medium' 
                                    : ''
                                }`}
                              >
                                {getMaterialIcon()}
                                <span className={`text-sm ${
                                  selectedLesson?.id === lesson.id ? 'text-purple-600 dark:text-purple-400' : ''
                                }`}>{lesson.title}</span>
                              </button>
                            );
                          })}
                          
                          {/* Quizzes */}
                          {module.quizzes.map((quiz) => (
                            <button
                              key={quiz.id}
                              onClick={() => {
                                loadQuiz(quiz.id);
                                setSelectedLesson(null);
                                // Expand the module containing the selected quiz
                                setOpenModule(`module-${module.id}`);
                              }}
                              className={`w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 transition-colors ${
                                selectedQuiz?.id === quiz.id 
                                  ? 'bg-purple-100 dark:bg-purple-900/20 border-l-4 border-purple-600 font-medium' 
                                  : ''
                              }`}
                            >
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                                selectedQuiz?.id === quiz.id ? 'text-purple-600' : ''
                              }`} />
                              <span className={`text-sm ${
                                selectedQuiz?.id === quiz.id ? 'text-purple-600 dark:text-purple-400' : ''
                              }`}>{quiz.title}</span>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLesson;
