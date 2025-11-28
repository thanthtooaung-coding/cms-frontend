import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@cms/ui/components/sidebar';

import { sidebarData } from './data/sidebar-data';
import { NavUser } from './nav-user';
import { NavGroup } from './NavGroup';

import { LogoHeader } from './LogoHeader';
import { useAuthDataStore } from '../../store/auth-store';
import { useMemo } from 'react';

// Filter sidebar items based on user role
const filterSidebarByRole = (navGroups: typeof sidebarData.navGroups, role?: string) => {
  // Instructor and Staff have the same permissions - can only see Dashboard, Course, and Enrollment
  const restrictedRoles = ['Instructor', 'Staff'];
  
  if (!role || !restrictedRoles.includes(role)) {
    // Admin, Owner see all items
    return navGroups;
  }

  // Instructor and Staff can only see Dashboard, Course, and Enrollment
  return navGroups.map((group) => {
    if (group.title === 'General') {
      return {
        ...group,
        items: group.items.filter((item) => {
          const url = 'url' in item ? item.url : undefined;
          return (
            url === '/' || // Dashboard
            url === '/course' || // Course
            url === '/enrollment' // Enrollment
          );
        }),
      };
    }
    // Keep "Other" group (Settings, Help Center)
    return group;
  });
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthDataStore();
  
  // Fallback user data if not logged in (shouldn't happen in authenticated layout, but safe fallback)
  const displayUser = user || {
    name: 'Guest',
    email: 'guest@example.com',
  };

  // Filter sidebar items based on role
  const filteredSidebarData = useMemo(() => {
    return filterSidebarByRole(sidebarData.navGroups, user?.roleName || user?.role);
  }, [user?.roleName, user?.role]);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        {filteredSidebarData.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
