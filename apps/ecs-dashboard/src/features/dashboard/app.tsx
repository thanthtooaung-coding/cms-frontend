import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@cms/ui/components/card';
import { ecsApiFetch } from '../../utils/apiClient';
import { useTenant } from '../../context/TenantContext';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCategories: number;
  totalPromotions: number;
  totalReviews: number;
}

export default function Dashboard() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { tenantId } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const fetchStats = async () => {
      try {
        const response = await ecsApiFetch(`/dashboard/stats?tenantId=${tenantId}`);
        if (response.ok) {
          const result = await response.json();
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers ?? 0, 
      icon: '👥', 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Products', 
      value: stats?.totalProducts ?? 0, 
      icon: '📦', 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders ?? 0, 
      icon: '🛒', 
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats?.totalRevenue ?? 0}`, 
      icon: '💰', 
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Pending Orders', 
      value: stats?.pendingOrders ?? 0, 
      icon: '⏳', 
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Categories', 
      value: stats?.totalCategories ?? 0, 
      icon: '📁', 
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      title: 'Promotions', 
      value: stats?.totalPromotions ?? 0, 
      icon: '🎁', 
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      title: 'Reviews', 
      value: stats?.totalReviews ?? 0, 
      icon: '⭐', 
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your store.</p>
      </div>
      
      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {statCards.map((stat, index) => (
            <Card 
              key={index}
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-lg shadow-md flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
