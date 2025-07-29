import { ChevronsUpDown } from 'lucide-react';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@cms/ui/components/sidebar';

export function LogoHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <img className="size-4" src="/logo.png" alt="" />
          </div>
          <div className="grid flex-1 text-left  leading-tight">
            <span className="truncate text-lg font-semibold">CMS Admin</span>
            <span className="truncate text-sm">Admin</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
