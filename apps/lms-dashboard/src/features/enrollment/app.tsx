import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { EnrollmentProvider } from './context/enrollment-context';
import { lmsApiFetch } from '../../utils/apiClient';
import { useAuthDataStore } from '../../store/auth-store';
import { Users, GraduationCap, BookOpen } from 'lucide-react';

interface EnrollmentStatistics {
  courseId: number;
  courseName: string;
  instructorId: number;
  instructorName: string;
  studentCount: number;
  certifiedStudentCount: number;
}

const EnrollmentApp = () => {
  const [statistics, setStatistics] = useState<EnrollmentStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthDataStore();
  const isOwner = user?.roleName === 'Owner' || user?.role === 'Owner';

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await lmsApiFetch('/enrollments/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch enrollment statistics');
        }
        const data = await response.json();
        setStatistics(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading enrollment statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Error fetching enrollment statistics: {error}</p>
      </div>
    );
  }

  return (
    <EnrollmentProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Enrollment Statistics</h1>
              <p className="text-muted-foreground">
                {isOwner 
                  ? 'View enrollment statistics for all instructors and their courses'
                  : 'View enrollment statistics for your courses'}
              </p>
            </div>
          </div>
          
          {statistics.length === 0 ? (
            <div className="border p-8 rounded-lg text-center bg-slate-50">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-700">No enrollment data found</p>
              <p className="text-sm text-slate-500 mt-2">
                {isOwner 
                  ? 'No courses or enrollments found for any instructors.'
                  : 'You don\'t have any courses with enrollments yet.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-full">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ tableLayout: 'auto' }}>
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      {isOwner && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Instructor
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Students Enrolled
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Certified Students
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {statistics.map((stat, index) => (
                      <tr key={`${stat.courseId}-${stat.instructorId}`} className="hover:bg-slate-50 transition-colors">
                        {isOwner && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium text-slate-900">{stat.instructorName}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-900">{stat.courseName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                            <Users className="w-3 h-3" />
                            {stat.studentCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                            <GraduationCap className="w-3 h-3" />
                            {stat.certifiedStudentCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Main>
    </EnrollmentProvider>
  );
};

export default EnrollmentApp;