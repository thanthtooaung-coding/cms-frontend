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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //   const { user } = useAuthDataStore();
  const user = {
    name: 'Brian',
    email: 'Brian@gmail.com',
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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
