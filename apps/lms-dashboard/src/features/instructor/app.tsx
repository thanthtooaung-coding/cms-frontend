import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { InstructorDialogs } from './actions/instructor-dialog';
import columns from './components/column';
import { DataTable } from './components/data-table';
import { InstructorProvider } from './context/instructor-context';
import type { InstructorType } from './data/schema';
import { Button } from '@cms/ui/components/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';

const InstructorApp = () => {
  const [data, setData] = useState<InstructorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?role=Staff`);
        if (!response.ok) {
          throw new Error('Failed to fetch instructors');
        }
        const apiData = await response.json();
        const formattedData: InstructorType[] = apiData.map((instructor: any) => ({
          id: instructor.id.toString(),
          name: instructor.name,
          email: instructor.email,
          role: instructor.role.name,
          name_space: instructor.tenant.name,
        }));
        setData(formattedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading instructors...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error fetching instructors: {error}</p>
      </div>
    );

  return (
    <InstructorProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Instructor Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Instructors</p>
            </div>
            <Link to="create">
              <Button>
                <Plus /> Create
              </Button>
            </Link>
          </div>
          <div>
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </Main>
      <InstructorDialogs />
    </InstructorProvider>
  );
};

export default InstructorApp;
