import Cookies from 'js-cookie';
import { Outlet } from 'react-router';
import { cn } from '@cms/ui/lib/utils';

import { SidebarProvider } from '@cms/ui/components/sidebar';
import { SearchProvider } from '../../context/search-context';
import SkipToMain from '../skip-to-main';
import { AppSidebar } from './AppSidebar';
import { NavigationProgress } from '../navigation-progress';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
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
