import CourseContent from '../components/CourseContent';
import CourseIntro from '../components/CourseIntro';
import InstructorSection from '../components/InstructorSection';
import CourseDetailInfo from '../components/CourseDetailBefore';
import { mockCourseDetailResponse } from '../api/mockDataCourse';
import { useCourseStore } from '../store/course-store';

const CourseDetail = () => {
  const { courseData } = useCourseStore();
  return (
    <>
      <div>
        <CourseIntro />
      </div>
      <div className="flex justify-center px-4 py-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl space-y-8">
          {/* Course Details and Content */}
          <div className="space-y-6">
            <CourseDetailInfo courseDetail={courseData} />
            <CourseContent />
            <InstructorSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
