import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuthDataStore } from '../../store/auth-store';
import { useTenant } from '../../context/TenantContext';
import { Button } from '@cms/ui/components/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Gift, 
  Star, 
  Users,
  LogOut,
  Store
} from 'lucide-react';
import { cn } from '@cms/ui/lib/utils';

export function AppSidebar() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const location = useLocation();
  const { user, logout } = useAuthDataStore();
  const { tenantInfo } = useTenant();
  
  // Determine base path based on current location
  let basePath = '/ecs-dashboard';
  if (tenantSlug) {
    if (location.pathname.includes('/ecommerce/')) {
      basePath = `/ecommerce/${tenantSlug}/ecs-dashboard`;
    } else {
      basePath = `/ecs-dashboard/${tenantSlug}`;
    }
  }

  const menuItems = [
    { path: '', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/refunds', label: 'Refunds', icon: DollarSign },
    { path: '/promotions', label: 'Promotions', icon: Gift },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/users', label: 'Users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen flex flex-col border-r border-slate-700/50 shadow-xl flex-shrink-0 fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {tenantInfo?.tenantName || 'ECS Dashboard'}
            </h1>
            <p className="text-xs text-slate-400">E-commerce System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = location.pathname === `${basePath}${item.path}` || 
            (item.path === '' && location.pathname === basePath);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={`${basePath}${item.path}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30" 
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        {user && (
          <div className="mb-3 p-3 rounded-lg bg-slate-700/30">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <Button 
          onClick={logout} 
          variant="destructive" 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

