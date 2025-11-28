import Cookies from 'js-cookie';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { cn } from '@cms/ui/lib/utils';
import { useEffect } from 'react';

import { SidebarProvider } from '@cms/ui/components/sidebar';
import { SearchProvider } from '../../context/search-context';
import { TenantProvider } from '../../context/TenantContext';
import SkipToMain from '../skip-to-main';
import { AppSidebar } from './AppSidebar';
import { NavigationProgress } from '../navigation-progress';
import { useAuthDataStore } from '../../store/auth-store';
import { DocumentTitle } from '../DocumentTitle';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthDataStore();

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!user && !location.pathname.includes('/login')) {
      const tenantSlug = location.pathname.match(/\/lms\/([^/]+)/)?.[1];
      if (tenantSlug) {
        navigate(`/lms/${tenantSlug}/login`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <TenantProvider>
      <DocumentTitle />
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <NavigationProgress />
          <SkipToMain />
          <AppSidebar />
          <div
            id="content"
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'sm:transition-[width] sm:duration-200 sm:ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            {children ? children : <Outlet />}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </TenantProvider>
  );
}
