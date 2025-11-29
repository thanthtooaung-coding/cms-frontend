import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Search } from '../../components/search';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Main } from '../../components/Layout/main';
import { Card, CardContent, CardHeader, CardTitle } from '@cms/ui/components/card';
import { lmsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';
import { useAuthDataStore } from '../../store/auth-store';
import { BookOpen, Users, GraduationCap, UserCheck, FileText, Award } from 'lucide-react';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalEnrollments: number;
  totalCertificates: number;
  totalCategories: number;
}

const DashboardApp = () => {
  const { tenantInfo, loading: tenantLoading } = useTenant();
  const { user } = useAuthDataStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get tenantId from tenantInfo or fallback to localStorage
    const tenantId = tenantInfo?.tenantId || (localStorage.getItem('tenant_id') ? Number(localStorage.getItem('tenant_id')) : null);
    
    // Wait for user to be available
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // If tenant is still loading, wait
    if (tenantLoading) {
      return;
    }

    // If no tenantId available, stop loading
    if (!tenantId) {
      console.warn('No tenant ID available for dashboard stats');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard stats for tenantId:', tenantId, 'userId:', user.id);
        const response = await lmsApiFetch(`/dashboard/stats?tenantId=${tenantId}`, {
          headers: {
            'X-User-Id': user.id,
          },
        });
        console.log('Dashboard stats response:', response.status, response.statusText);
        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard stats data:', data);
          setStats(data);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch dashboard stats:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [tenantInfo?.tenantId, user?.id, tenantLoading]);

  if (loading) {
    return (
      <div>
        <Header>
          <Search />
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </Main>
      </div>
    );
  }

  // Determine which cards to show based on role
  const isOwner = user?.roleName === 'Owner' || user?.roleName === 'Admin';

  const ownerCards = [
    { 
      title: 'Total Courses', 
      value: stats?.totalCourses ?? 0, 
      icon: BookOpen, 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Students', 
      value: stats?.totalStudents ?? 0, 
      icon: Users, 
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Instructors', 
      value: stats?.totalInstructors ?? 0, 
      icon: UserCheck, 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Total Enrollments', 
      value: stats?.totalEnrollments ?? 0, 
      icon: FileText, 
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Total Certificates', 
      value: stats?.totalCertificates ?? 0, 
      icon: Award, 
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Total Categories', 
      value: stats?.totalCategories ?? 0, 
      icon: BookOpen, 
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
  ];

  const instructorCards = [
    { 
      title: 'My Courses', 
      value: stats?.totalCourses ?? 0, 
      icon: BookOpen, 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Students Enrolled', 
      value: stats?.totalStudents ?? 0, 
      icon: Users, 
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Certified Students', 
      value: stats?.totalCertificates ?? 0, 
      icon: GraduationCap, 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const statCards = isOwner ? ownerCards : instructorCards;

  return (
    <div>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="w-full p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              {isOwner 
                ? "Welcome back! Here's an overview of your learning management system."
                : "Welcome back! Here's an overview of your courses and students."}
            </p>
          </div>
          
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card 
                    key={index}
                    className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                          {stat.title}
                        </CardTitle>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Main>
    </div>
  );
};

export default DashboardApp;
