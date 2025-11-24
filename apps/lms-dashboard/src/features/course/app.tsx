import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { DataTable } from './components/data-table';
import columns from './components/column';
import { CourseDialogs } from './actions/course-dialog';
import { CourseProvider } from './context/course-context';
import { AddCourse } from './actions/add-course-btn';
import type { Course } from './data/schema';

const CourseApp = () => {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const apiData = await response.json();

        const formattedData: Course[] = apiData.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category.name,
          instructor: course.instructor.name,
          instructorId: course.instructor.id, // Store instructor ID for linking
          createdAt: new Date(course.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: course.status ? course.status.toLowerCase() : 'pending',
        }));

        setData(formattedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading courses...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p>Error fetching courses: {error}</p></div>;

  return (
    <CourseProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Course Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Courses</p>
            </div>
            <AddCourse />
          </div>

          <div>
            <DataTable data={data} columns={columns} />
            <CourseDialogs />
          </div>
          
        </div>
      </Main>
    </CourseProvider>
  );
};

export default CourseApp;