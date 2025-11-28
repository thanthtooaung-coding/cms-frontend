import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import columns from './components/column';
import { DataTable } from './components/data-table';
import { EnrollmentProvider } from './context/enrollment-context';
import type { EnrollmentType } from './data/schema';
import { lmsApiFetch } from '../../utils/apiClient';

const EnrollmentApp = () => {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await lmsApiFetch('/enrollments');
        if (!response.ok) {
          throw new Error('Failed to fetch enrollments');
        }
        const data = await response.json();
        const formattedData: EnrollmentType[] = data.map((enrollment: any) => ({
          id: enrollment.id.toString(),
          studentName: enrollment.student.name,
          studentEmail: enrollment.student.email,
          courseName: enrollment.course.name,
          category: enrollment.category.name,
          createdAt: new Date(enrollment.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }));

        setEnrollmentData(formattedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading enrollments...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p>Error fetching enrollments: {error}</p></div>;

  return (
    <EnrollmentProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Enrollment Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Enrollments</p>
            </div>
          </div>
          <div>
            <DataTable data={enrollmentData} columns={columns} />
          </div>
        </div>
      </Main>
    </EnrollmentProvider>
  );
};

export default EnrollmentApp;