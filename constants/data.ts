import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Bản đồ',
    url: '/map',
    icon: 'map',
    isActive: false,
    shortcut: ['b', 'm'],
    items: []
  },
  {
    title: 'Bất động sản',
    url: '/properties',
    icon: 'home',
    isActive: false,
    shortcut: ['b', 'b'],
    items: []
  },
  {
    title: 'Khách hàng',
    url: '/clients',
    icon: 'users',
    isActive: false,
    shortcut: ['k', 'k'],
    items: []
  },
  {
    title: 'Lịch hẹn',
    url: '/appointments',
    icon: 'calendar',
    isActive: false,
    shortcut: ['l', 'l'],
    items: []
  }
];
