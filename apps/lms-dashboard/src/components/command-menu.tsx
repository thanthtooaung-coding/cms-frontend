import React from 'react';

import { IconArrowRightDashed, IconChevronRight } from '@tabler/icons-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@cms/ui/components/command';

import { ScrollArea } from '@cms/ui/components/scroll-area';
import { useTenantNavigate } from '../hooks/useTenantNavigate';
import { useSearch } from '../context/search-context';
import { sidebarData } from './Layout/data/sidebar-data';
import { useAuthDataStore } from '../store/auth-store';

// Filter sidebar items based on user role (same logic as AppSidebar)
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

export function CommandMenu() {
  const navigate = useTenantNavigate();
  const { user } = useAuthDataStore();
  const { open, setOpen } = useSearch();

  // Filter sidebar items based on role
  const filteredSidebarData = React.useMemo(() => {
    return filterSidebarByRole(sidebarData.navGroups, user?.roleName || user?.role);
  }, [user?.roleName, user?.role]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredSidebarData.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate(navItem.url));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate(subItem.url));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <IconArrowRightDashed className="text-muted-foreground/80 size-2" />
                    </div>
                    {navItem.title} <IconChevronRight /> {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
