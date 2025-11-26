import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { cn } from '@cms/ui/lib/utils';

import { SidebarProvider } from '@cms/ui/components/sidebar';
import { SearchProvider } from '../../context/search-context';
import SkipToMain from '../skip-to-main';
import { AppSidebar } from './AppSidebar';
import { NavigationProgress } from '../navigation-progress';
import { useAuthDataStore } from '../../store/auth-store';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthDataStore();
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token || !isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  // Don't render if not authenticated
  const token = localStorage.getItem('auth_token');
  if (!token || !isAuthenticated()) {
    return null;
  }

  return (
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
  );
}
