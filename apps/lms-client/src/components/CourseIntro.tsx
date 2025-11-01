import { Badge, Captions, Settings } from 'lucide-react';
import { Star } from 'lucide-react';
import { Button } from '@cms/ui/components/button';
import { useCourseStore } from '../store/course-store';
import { useNavigate } from 'react-router-dom';

const CourseIntro = () => {
  const { courseData } = useCourseStore();
  const navigate = useNavigate();

  return (
    <>
      <div className="relative max-w-7xl mx-auto bg-black text-white p-6 space-y-4">
        <nav className="text-[#c4c6ff] text-sm font-medium flex items-center pt-0 pb-5">
          <span className="font-bold">{courseData?.category.name} </span>
          <span className="text-white px-1">&gt;</span>
          <span className="font-bold">{courseData?.course.name}</span>
        </nav>
        {/* Enroll button in top-right */}
        <Button
          onClick={() => navigate(`/course-lesson`)}
          className="absolute top-6 right-6 p-4 text-white text-md px-6 bg-purple-700 hover:bg-purple-800"
        >
          Enroll Course
        </Button>

        <h1 className="text-3xl font-bold text-white">{courseData?.course.name}</h1>

        <p className="text-gray-300">{courseData?.course.description}</p>

        <div className="flex items-center space-x-4">
          <Badge className="bg-teal-500 text-white">Bestseller</Badge>
          <div className="flex items-center text-yellow-400">
            <span className="font-semibold text-lg">{courseData?.course.rating.averageRating}</span>
            <Star className="w-4 h-4 ml-1 fill-yellow-400" />
          </div>
          <span className="text-gray-400">{courseData?.course.totalEnrolledStudents} enrolled</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-400 text-sm">
          <span>⚙️Updated at {courseData?.course.updatedAt}</span>
          <span>🌐 English</span>
          <span> English [CC] </span>
        </div>
      </div>
    </>
  );
};

export default CourseIntro;
