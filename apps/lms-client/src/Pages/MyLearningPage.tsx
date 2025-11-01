import { useState } from 'react';
import { Search } from 'lucide-react';
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
import { getUserCourses } from '../api/mockData';
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

const MyLearningPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const userCourses = getUserCourses();
  const coursesPerPage = 8;
  const totalPages = Math.ceil(userCourses.length / coursesPerPage);

  const getCourseProgress = (courseId: string) => {
    // Mock progress data
    const progressMap: { [key: string]: number } = {
      '1': 75,
      '2': 45,
      '3': 90,
      '4': 30,
      '5': 60,
    };
    return progressMap[courseId] || 0;
  };

  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = userCourses.slice(startIndex, endIndex);
  // const paginate = (items: CourseData[], currentPage: number, itemsPerPage: number): Course[] => {
  //   const start = (currentPage - 1) * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   return items.slice(start, end);
  // };

  // const currentCourses = paginate(userCourses, currentPage, coursesPerPage);

  console.log('user course', userCourses);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Learning
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track your progress and continue learning
            </p>
          </div>
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:w-96">
              <TabsTrigger value="courses">All Courses</TabsTrigger>
              <TabsTrigger value="lists">My Lists</TabsTrigger>
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
                    <SelectItem value="progress">Progress</SelectItem>
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
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Artifical Intelligence</SelectItem>
                    <SelectItem value="business">Cyber Security</SelectItem>
                    <SelectItem value="marketing">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {currentCourses.map((data, index) => (
                  <CourseCard
                    key={index}
                    data={data}
                    course={data.course}
                    instructor={data.instructor}
                    category={data.category}
                    variant="compact"
                    showProgress
                    progress={Math.random() * 100}
                  />
                ))}
              </div>

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

            <TabsContent value="lists" className="mt-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lists Created Yet</h3>
                <p className="text-gray-600 mb-4">Create custom lists to organize your courses</p>
                <Button>Create Your First List</Button>
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certifications Yet</h3>
                <p className="text-gray-600 mb-4">Complete courses to earn certificates</p>
                <Button variant="outline">Browse Courses</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MyLearningPage;
