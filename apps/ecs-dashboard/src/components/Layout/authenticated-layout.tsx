import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { TenantProvider } from '../../context/TenantContext';
import { useAuthDataStore } from '../../store/auth-store';
import { AppSidebar } from './AppSidebar';

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthDataStore();

  useEffect(() => {
    if (!user && !location.pathname.includes('/login')) {
      // Try to match /ecommerce/:tenantSlug/ecs-dashboard pattern first
      let tenantSlug = location.pathname.match(/\/ecommerce\/([^/]+)\/ecs-dashboard/)?.[1];
      if (tenantSlug) {
        navigate(`/ecommerce/${tenantSlug}/ecs-dashboard/login`, { replace: true });
      } else {
        // Fallback to old pattern
        tenantSlug = location.pathname.match(/\/ecs-dashboard\/([^/]+)/)?.[1];
        if (tenantSlug) {
          navigate(`/ecs-dashboard/${tenantSlug}/login`, { replace: true });
        } else {
          navigate('/ecs-dashboard/login', { replace: true });
        }
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <TenantProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto ml-64 w-full">
          <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </TenantProvider>
  );
}

