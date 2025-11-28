import { Home, LayoutDashboard, MessageCircle } from 'lucide-react';

import type { NavItems } from '../types';

export const NAV_ITEMS: NavItems = [
  { icon: Home, label: 'Главная', url: '/' },
  { icon: LayoutDashboard, label: 'Лента', url: '/feed' },
  { icon: MessageCircle, label: 'Чаты', url: '/chats' },
];
