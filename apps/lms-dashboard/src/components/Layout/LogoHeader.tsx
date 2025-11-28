import { ChevronsUpDown } from 'lucide-react';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@cms/ui/components/sidebar';
import { useTenant } from '../../context/TenantContext';

export function LogoHeader() {
  const { tenantInfo } = useTenant();
  
  const pageTitle = tenantInfo?.pageTitle || 'LMS Admin';
  const logoUrl = tenantInfo?.logoUrl || '/logo.png';
  const tenantName = tenantInfo?.tenantName || 'Admin';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
            <img 
              className="size-full object-cover" 
              src={logoUrl} 
              alt={pageTitle}
              onError={(e) => {
                // Fallback to default logo if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/logo.png';
              }}
            />
          </div>
          <div className="grid flex-1 text-left  leading-tight">
            <span className="truncate text-lg font-semibold">{pageTitle}</span>
            <span className="truncate text-sm">{tenantName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
