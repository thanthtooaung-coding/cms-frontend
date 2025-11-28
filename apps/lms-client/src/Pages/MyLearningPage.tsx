import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui/components/tabs';
import CourseCard from '../components/CourseCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@cms/ui/components/pagination';
import type { CourseData } from '../api/types/courseData';
import { lmsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';

interface EnrolledCourseResponse {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  categoryName: string;
  categoryId: number;
  instructorName: string;
  instructorId: number;
  instructorEmail: string;
  enrollmentDate: string;
  enrollmentStatus: string;
  totalModules: number;
  totalLessons: number;
  totalQuizzes: number;
  averageRating: number;
  totalRatings: number;
  totalEnrolledStudents: number;
  courseCreatedAt: string;
  courseUpdatedAt: string;
  courseStatus: string;
  durationDayCount: number;
  hasCertificate: boolean;
  certificateScore: number | null;
}

interface Category {
  id: number;
  name: string;
}

const MyLearningPage = () => {
  const { user } = useAuthDataStore();
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await lmsApiFetch('/categories', {}, true);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        // Fetch enrolled courses
        const response = await lmsApiFetch(`/enrollments/student/${user.id}/courses`, {
          method: 'GET',
        }, false);

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const data = await response.json();
        setEnrolledCourses(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Transform enrolled courses to CourseData format
  const transformToCourseData = (enrolled: EnrolledCourseResponse): CourseData => {
    const durationDays = enrolled.durationDayCount || 0;
    const durationText = durationDays === 1 ? '1 day' : `${durationDays} days`;

    return {
      course: {
        id: enrolled.courseId,
        name: enrolled.courseTitle,
        description: enrolled.courseDescription,
        shortDescription: enrolled.courseDescription.substring(0, 100) + '...',
        rating: {
          averageRating: enrolled.averageRating || 0,
          totalRating: enrolled.totalRatings || 0,
        },
        modules: [], // We don't need full module details for the card
        imgUrl: `https://picsum.photos/seed/${enrolled.courseId}/400/225`,
        duration: durationText,
        totalEnrolledStudents: enrolled.totalEnrolledStudents || 0,
        createdAt: enrolled.courseCreatedAt || new Date().toISOString(),
        updatedAt: enrolled.courseUpdatedAt || new Date().toISOString(),
        whatYouWillLearn: [],
        requirements: [],
      },
      instructor: {
        id: enrolled.instructorId,
        name: enrolled.instructorName,
        email: enrolled.instructorEmail,
        phoneNumber: '',
        totalCourses: 0,
        totalStudents: 0,
      },
      category: {
        id: enrolled.categoryId,
        name: enrolled.categoryName,
      },
    };
  };

  // Filter and sort courses
  const filteredCourses = enrolledCourses.filter(course => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = course.courseTitle.toLowerCase().includes(query) ||
                           course.courseDescription.toLowerCase().includes(query) ||
                           course.categoryName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (filterBy !== 'all') {
      const selectedCategory = categories.find(cat => cat.id.toString() === filterBy || cat.name === filterBy);
      if (selectedCategory) {
        if (course.categoryName !== selectedCategory.name) {
          return false;
        }
      }
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
      case 'title':
        return a.courseTitle.localeCompare(b.courseTitle);
      case 'completion':
        // Sort by certificate status
        if (a.hasCertificate && !b.hasCertificate) return -1;
        if (!a.hasCertificate && b.hasCertificate) return 1;
        return 0;
      default:
        return 0;
    }
  });

  const coursesPerPage = 8;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);


  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex).map(transformToCourseData);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your enrolled courses</p>
          <Button onClick={() => navigate(`${basePath}/login`)}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Learning
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Continue your learning journey
            </p>
          </div>
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:w-96">
              <TabsTrigger value="courses">All Courses</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-8">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search my courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Accessed</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Grid */}
              {currentCourses.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Enrolled Courses</h3>
                  <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
                  <Button onClick={() => navigate(`${basePath}/courses`)}>Browse Courses</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {currentCourses.map((data, index) => {
                    const enrolledCourse = filteredCourses[startIndex + index];
                    return (
                      <CourseCard
                        key={enrolledCourse?.enrollmentId || index}
                        data={data}
                        course={data.course}
                        instructor={data.instructor}
                        category={data.category}
                        variant="compact"
                        hasCertificate={enrolledCourse?.hasCertificate || false}
                      />
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>

            <TabsContent value="certifications" className="mt-8">
              {enrolledCourses.filter(c => c.hasCertificate).length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certifications Yet</h3>
                  <p className="text-gray-600 mb-4">Complete courses with 75% or higher score to earn certificates</p>
                  <Button variant="outline" onClick={() => navigate(`${basePath}/courses`)}>Browse Courses</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {enrolledCourses
                    .filter(c => c.hasCertificate)
                    .map(enrolled => {
                      const data = transformToCourseData(enrolled);
                      return (
                        <CourseCard
                          key={enrolled.enrollmentId}
                          data={data}
                          course={data.course}
                          instructor={data.instructor}
                          category={data.category}
                          variant="compact"
                          hasCertificate={true}
                        />
                      );
                    })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MyLearningPage;
