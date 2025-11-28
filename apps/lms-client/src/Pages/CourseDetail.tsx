import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import CourseContent from '../components/CourseContent';
import CourseIntro from '../components/CourseIntro';
import InstructorSection from '../components/InstructorSection';
import CourseDetailInfo from '../components/CourseDetailBefore';
import { useCourseStore } from '../store/course-store';
import { fetchCourseById } from '../utils/courseUtils';
import type { CourseData } from '../api/types/courseData';
import { Button } from '@cms/ui/components/button';
import { ArrowLeft } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courseData, setCourseData } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const courseId = parseInt(id, 10);
        if (isNaN(courseId)) {
          throw new Error('Invalid course ID');
        }

        const data = await fetchCourseById(courseId);
        setCourseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course data');
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id, setCourseData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course information...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4 text-lg">{error || 'Course not found'}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!courseData?.course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4 text-lg">Course data is not available</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <CourseIntro />
      </div>
      <div className="flex justify-center px-4 py-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl space-y-8">
          {/* Course Details and Content */}
          <div className="space-y-6">
            <CourseDetailInfo courseDetail={courseData.course} />
            <CourseContent />
            <InstructorSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
