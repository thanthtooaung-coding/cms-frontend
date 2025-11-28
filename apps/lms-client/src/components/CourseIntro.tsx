import { Badge, Captions, Settings } from 'lucide-react';
import { Button } from '@cms/ui/components/button';
import { useCourseStore } from '../store/course-store';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { lmsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';
import CertificateDisplay from './CertificateDisplay';

const CourseIntro = () => {
  const { courseData } = useCourseStore();
  const navigate = useNavigate();
  const { id, tenantSlug } = useParams<{ id: string; tenantSlug?: string }>();
  const { user } = useAuthDataStore();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !id) {
        setIsEnrolled(false);
        setLoadingEnrollment(false);
        return;
      }

      try {
        setLoadingEnrollment(true);
        const response = await lmsApiFetch(`/enrollments/check/${user.id}/${id}`, {
          method: 'GET',
        }, false);

        if (!response.ok) {
          // If not found, it means not enrolled, not an error
          if (response.status === 404) {
            setIsEnrolled(false);
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Failed to check enrollment status' }));
            throw new Error(errorData.message || 'Failed to check enrollment status');
          }
        } else {
          const data = await response.json();
          setIsEnrolled(data.enrolled);
        }
      } catch (err) {
        console.error('Error checking enrollment:', err);
        setIsEnrolled(false); // Assume not enrolled on error
      } finally {
        setLoadingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [user, id]);

  if (!courseData) {
    return null;
  }

  const course = courseData.course;
  const category = courseData.category;
  const totalEnrolled = course?.totalEnrolledStudents || 0;
  const updatedAt = course?.updatedAt 
    ? new Date(course.updatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A';

  const handleEnroll = async () => {
    if (!id || !user?.id) {
      setEnrollmentError('Please log in to enroll in this course');
      return;
    }

    setIsEnrolling(true);
    setEnrollmentError(null);

    try {
      const response = await lmsApiFetch('/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          courseId: parseInt(id, 10),
          studentId: user.id
        })
      }, false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to enroll' }));
        throw new Error(errorData.message || 'Failed to enroll in course');
      }

      // Mark as enrolled and navigate to course lesson page
      setIsEnrolled(true);
      const lessonPath = tenantSlug 
        ? `/lms/${tenantSlug}/course/${id}/lesson` 
        : `/course/${id}/lesson`;
      navigate(lessonPath);
    } catch (err) {
      setEnrollmentError(err instanceof Error ? err.message : 'Failed to enroll in course');
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <>
      <div className="relative max-w-7xl mx-auto bg-black text-white p-6 space-y-4">
        <nav className="text-[#c4c6ff] text-sm font-medium flex items-center pt-0 pb-5">
          <span className="font-bold">{category?.name || 'Uncategorized'} </span>
          <span className="text-white px-1">&gt;</span>
          <span className="font-bold">{course?.name || 'Course'}</span>
        </nav>
        {/* Enroll/Go to Course button in top-right */}
        <div className="absolute top-6 right-6">
          {enrollmentError && (
            <p className="text-red-400 text-sm mb-2">{enrollmentError}</p>
          )}
          {loadingEnrollment ? (
            <Button
              disabled
              className="p-4 text-white text-md px-6 bg-purple-700 opacity-50"
            >
              Loading...
            </Button>
          ) : isEnrolled ? (
            <Button
              onClick={() => {
                const lessonPath = tenantSlug 
                  ? `/lms/${tenantSlug}/course/${id}/lesson` 
                  : `/course/${id}/lesson`;
                navigate(lessonPath);
              }}
              className="p-4 text-white text-md px-6 bg-green-600 hover:bg-green-700"
            >
              Go to Course
            </Button>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={isEnrolling || !user}
              className="p-4 text-white text-md px-6 bg-purple-700 hover:bg-purple-800 disabled:opacity-50"
            >
              {isEnrolling ? 'Enrolling...' : user ? 'Enroll Course' : 'Login to Enroll'}
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white">{course?.name || 'Course Title'}</h1>

        <p className="text-gray-300">{course?.description || course?.shortDescription || 'No description available'}</p>

        <div className="flex items-center space-x-4">
          <Badge className="bg-teal-500 text-white">Bestseller</Badge>
          <span className="text-gray-400">{totalEnrolled.toLocaleString()} enrolled</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-400 text-sm">
          <span>⚙️Updated at {updatedAt}</span>
          <span>🌐 English</span>
          <span> English [CC] </span>
        </div>
      </div>
      {user && id && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <CertificateDisplay courseId={parseInt(id, 10)} studentId={user.id} />
        </div>
      )}
    </>
  );
};

export default CourseIntro;
