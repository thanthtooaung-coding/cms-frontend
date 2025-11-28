import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@cms/ui/components/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@cms/ui/components/sidebar';
import { Badge } from '@cms/ui/components/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';

import { Link, useLocation, useParams } from 'react-router';
import type { NavCollapsible, NavGroup, NavItem, NavLink } from './types';

export function NavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar();
  const href = useLocation().pathname ?? '';
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  
  // Helper function to make URLs tenant-aware
  const makeTenantUrl = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (!tenantSlug) return url;
    // If URL is absolute (starts with /), prepend /lms/tenantSlug
    if (url.startsWith('/')) {
      // For root path, return /lms/tenantSlug
      if (url === '/') {
        return `/lms/${tenantSlug}`;
      }
      return `/lms/${tenantSlug}${url}`;
    }
    // If relative, just return as is (React Router will handle it)
    return url;
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url || 'no-url'}`;
          
          // Handle items with url (NavLink)
          if ('url' in item && item.url) {
            const tenantItem = { ...item, url: makeTenantUrl(item.url) };
            return <SidebarMenuLink key={key} item={tenantItem} href={href} />;
          }
          
          // Handle collapsible items (NavCollapsible) - they have items but no url
          if ('items' in item && item.items) {
            const tenantItem = {
              ...item,
              items: item.items.map(subItem => ({
                ...subItem,
                url: makeTenantUrl(subItem.url)
              }))
            };

            if (state === 'collapsed')
              return <SidebarMenuCollapsedDropdown key={key} item={tenantItem} href={href} />;

            return <SidebarMenuCollapsible key={key} item={tenantItem} href={href} />;
          }
          
          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0  text-lg">{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={checkIsActive(href, item)} tooltip={item.title}>
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon className="text-md" />}
          <span className="text-[15px]">{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild isActive={checkIsActive(href, subItem)}>
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={checkIsActive(href, item)}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link to={sub.url} className={checkIsActive(href, sub) ? 'bg-secondary' : ''}>
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && <span className="ml-auto text-xs">{sub.badge}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const hrefPath = href.split('?')[0];
  
  // For items with url (NavLink)
  if ('url' in item && item.url) {
    const itemPath = typeof item.url === 'string' ? item.url.split('?')[0] : '';
    return (
      hrefPath === itemPath ||
      hrefPath === itemPath + '/' ||
      itemPath === hrefPath + '/'
    );
  }
  
  // For collapsible items (NavCollapsible) - check sub-items
  if ('items' in item && item.items) {
    const hasActiveSubItem = item.items.some((i) => {
      if (!i.url) return false;
      const subPath = typeof i.url === 'string' ? i.url.split('?')[0] : '';
      return hrefPath === subPath || hrefPath === subPath + '/' || subPath === hrefPath + '/';
    });
    
    if (mainNav) {
      // For main nav, also check if href ends with any sub-item path
      return hasActiveSubItem || item.items.some((i) => {
        if (!i.url) return false;
        const subPath = typeof i.url === 'string' ? i.url.split('?')[0] : '';
        return hrefPath.endsWith(subPath);
      });
    }
    
    return hasActiveSubItem;
  }
  
  return false;
}
