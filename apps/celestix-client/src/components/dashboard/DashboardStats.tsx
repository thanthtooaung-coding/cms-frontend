import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Film, Calendar, ShoppingCart, Shield } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'k';
  }
  return num.toString();
};

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCinemas: 0,
    totalMovies: 0,
    totalAdmins: 0,
    totalReservations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth("/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          console.error("Failed to fetch dashboard stats");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      label: "TOTAL USERS",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "TOTAL CINEMAS",
      value: stats.totalCinemas,
      icon: Film,
      color: "bg-purple-500",
    },
    {
      label: "TOTAL MOVIES",
      value: formatNumber(stats.totalMovies),
      icon: Calendar,
      color: "bg-pink-500",
    },
    {
      label: "TOTAL ADMIN",
      value: stats.totalAdmins,
      icon: Shield,
      color: "bg-green-500",
    },
    {
      label: "TOTAL RESERVATION",
      value: formatNumber(stats.totalReservations),
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="glass-card p-6 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};