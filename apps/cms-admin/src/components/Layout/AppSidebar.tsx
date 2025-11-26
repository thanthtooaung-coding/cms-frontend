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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthDataStore();
  
  // Default user if not authenticated (shouldn't happen due to auth guard)
  const displayUser = user || {
    name: 'Guest',
    email: 'guest@example.com',
  };
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
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
