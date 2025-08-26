import {
  IconFileAnalytics,
  IconHelp,
  IconLayoutDashboard,
  IconSettings,
  IconTool,
  IconUserCog,
  IconBook,
  IconTags,
  IconChalkboard,
  IconTable
} from '@tabler/icons-react';
import type { SidebarData } from '../types';

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Report',
          url: '/report',
          icon: IconFileAnalytics,
        },
        {
          title: 'Instructor',
          url: '/instructor',
          icon: IconChalkboard,
        },
        {
          title: 'Course',
          url: '/course',
          icon: IconBook,
        },
        {
          title: 'Category',
          url: '/category',
          icon: IconTags,
        },
        {
          title: 'Enrollment',
          url: '/enrollment',
          icon: IconTable,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
};
