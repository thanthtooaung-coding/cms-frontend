import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Mail, BookOpen, Users, MapPin, Phone, ArrowLeft, GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@cms/ui/components/avatar';
import { Card, CardContent } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { fetchTeacherById, fetchCoursesByInstructor, type TeacherResponse, type CourseResponse } from '../api/teacherApi';
import CourseCard from '../components/CourseCard';
import type { CourseData, Instructor, Category, Course } from '../api/types/courseData';

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherResponse | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeacherData = async () => {
      if (!id) {
        setError('Teacher ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const teacherId = parseInt(id, 10);
        const [teacherData, coursesData] = await Promise.all([
          fetchTeacherById(teacherId),
          fetchCoursesByInstructor(teacherId),
        ]);

        setTeacher(teacherData);
        setCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teacher data');
        console.error('Error loading teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher information...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Teacher not found'}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Convert CourseResponse to CourseData format for CourseCard component
  const convertToCourseData = (course: CourseResponse): CourseData => {
    const instructor: Instructor = {
      id: course.instructor.id,
      name: course.instructor.name,
      email: course.instructor.email,
      phoneNumber: teacher.phoneNumber || '',
      totalCourses: courses.length,
      totalStudents: 0, // This would need to be calculated from enrollments
    };

    const category: Category = course.category || {
      id: course.category.id,
      name: 'Uncategorized',
    };

    const courseData: Course = {
      id: course.id,
      name: course.title,
      shortDescription: course.description.substring(0, 100) + '...',
      description: course.description,
      imgUrl: `https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=225`,
      rating: {
        averageRating: 0,
        totalRating: 0,
      },
      totalEnrolledStudents: 0,
      createdAt: '',
      updatedAt: '',
      whatYouWillLearn: [],
      duration: '30 hours', // Default duration, would come from backend
      modules: [],
      requirements: [],
    };

    return {
      category,
      course: courseData,
      instructor,
    };
  };

  // Use actual statistics from API, fallback to calculated values if not available
  const totalCourses = teacher.totalCourses ?? courses.length;
  const totalStudents = teacher.totalStudents ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-white hover:bg-white/20 border-white/20 h-auto py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 border-4 border-white shadow-xl ring-4 ring-white/20">
                  <AvatarFallback className="text-2xl sm:text-3xl bg-purple-500 text-white font-bold">
                    {teacher.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 break-words">
                  {teacher.name}
                </h1>
                <p className="text-purple-100 text-lg sm:text-xl mb-6 break-words">
                  {teacher.role.name} • {teacher.tenant.name}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">
                      {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                    <Users className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">
                      {totalStudents.toLocaleString()} Students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Sidebar - Teacher Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {teacher.email && (
                        <div className="flex items-start gap-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <a
                            href={`mailto:${teacher.email}`}
                            className="text-purple-600 dark:text-purple-400 hover:underline break-all"
                          >
                            {teacher.email}
                          </a>
                        </div>
                      )}
                      {teacher.phoneNumber && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 break-all">{teacher.phoneNumber}</span>
                        </div>
                      )}
                      {teacher.address && (
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 break-words">{teacher.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Courses</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{totalCourses}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{totalStudents.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {(teacher.role.name === 'Staff' || teacher.role.name === 'Instructor') && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                        <GraduationCap className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Certified Instructor</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Courses */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Courses by {teacher.name}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Explore all courses taught by this instructor
              </p>
            </div>

            {courses.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    No courses yet
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    This instructor hasn't published any courses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const courseData = convertToCourseData(course);
                  return (
                    <CourseCard
                      key={course.id}
                      data={courseData}
                      course={courseData.course}
                      instructor={courseData.instructor}
                      category={courseData.category}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;

