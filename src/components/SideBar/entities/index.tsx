import { Home, LayoutDashboard, MessageCircle, UserCircle2 } from 'lucide-react';

import type { NavItems } from '../types';

export const NAV_ITEMS: NavItems = [
  { icon: Home, label: 'Главная', url: '/' },
  { icon: LayoutDashboard, label: 'Лента', url: '/feed' },
  { icon: UserCircle2, label: 'Профиль', url: '/profile' },
  { icon: MessageCircle, label: 'Чаты', url: '/chats' },
];
