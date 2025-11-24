import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Star, Mail, BookOpen, Users, MapPin, Phone, ArrowLeft, GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@cms/ui/components/avatar';
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
        averageRating: 4.5, // Default rating, would come from backend
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

  // Calculate total students (mock for now, would need enrollment data)
  const totalStudents = courses.length * 100; // Placeholder calculation
  const averageRating = 4.7; // Placeholder, would come from course ratings

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`}
                alt={teacher.name}
              />
              <AvatarFallback className="text-2xl bg-purple-500">
                {teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
              <p className="text-purple-100 text-lg mb-4">
                {teacher.role.name} • {teacher.tenant.name}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{averageRating.toFixed(1)} Instructor Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{courses.length} Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{totalStudents.toLocaleString()} Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Teacher Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {teacher.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-purple-600 hover:underline"
                        >
                          {teacher.email}
                        </a>
                      </div>
                    )}
                    {teacher.phoneNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{teacher.phoneNumber}</span>
                      </div>
                    )}
                    {teacher.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span>{teacher.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Courses</span>
                      <span className="font-semibold">{courses.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Students</span>
                      <span className="font-semibold">{totalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {teacher.role.name === 'Staff' && (
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 text-purple-600">
                      <GraduationCap className="w-5 h-5" />
                      <span className="font-semibold">Certified Instructor</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Courses */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Courses by {teacher.name}</h2>
              <p className="text-gray-600">
                Explore all courses taught by this instructor
              </p>
            </div>

            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-gray-600">
                    This instructor hasn't published any courses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

export default TeacherDetail;

