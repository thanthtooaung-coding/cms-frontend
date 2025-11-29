import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout/Header';
import { Search } from '../../components/search';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Main } from '../../components/Layout/main';
import { Card, CardContent, CardHeader, CardTitle } from '@cms/ui/components/card';
import { authenticatedFetch } from '../../utils/apiClient';
import { Users, FileText, CheckCircle, Clock, XCircle, Globe, GraduationCap, ShoppingBag, BookOpen } from 'lucide-react';

interface DashboardStats {
  totalOwners: number;
  totalPageRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalPages: number;
  lmsRequests: number;
  bmsRequests: number;
  ecommerceRequests: number;
}

const DashboardApp = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
        const response = await authenticatedFetch(`${API_BASE_URL}/cms/dashboard/stats`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (error) {
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
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        </Main>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Owners', 
      value: stats?.totalOwners ?? 0, 
      icon: Users, 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Page Requests', 
      value: stats?.totalPageRequests ?? 0, 
      icon: FileText, 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Pending Requests', 
      value: stats?.pendingRequests ?? 0, 
      icon: Clock, 
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Approved Requests', 
      value: stats?.approvedRequests ?? 0, 
      icon: CheckCircle, 
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Rejected Requests', 
      value: stats?.rejectedRequests ?? 0, 
      icon: XCircle, 
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      title: 'Total Pages', 
      value: stats?.totalPages ?? 0, 
      icon: Globe, 
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      title: 'LMS Requests', 
      value: stats?.lmsRequests ?? 0, 
      icon: GraduationCap, 
      gradient: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    { 
      title: 'BMS Requests', 
      value: stats?.bmsRequests ?? 0, 
      icon: BookOpen, 
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      title: 'E-Commerce Requests', 
      value: stats?.ecommerceRequests ?? 0, 
      icon: ShoppingBag, 
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    },
  ];

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
            <p className="text-slate-600">Welcome back! Here's an overview of your CMS system.</p>
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
