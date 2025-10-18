import { CardSim, Diff, MessageCircle, UserRound } from 'lucide-react';

import type { NavigationRoutes, Rows } from '../types';

export const navigationRoutes: NavigationRoutes = [
  { name: 'my-orders', path: '/my-orders' },
  { name: 'my-profile', path: '/my-profile' },
  { name: 'my-services', path: '/my-services' },
  { name: 'my-chats', path: '/my-chats' },
];

export const ROWS: Rows = [
  { icon: Diff, label: 'Мои заказы', url: navigationRoutes[0].path },
  {
    icon: UserRound,
    label: 'Профиль',
    url: navigationRoutes[1].path,
  },
  {
    icon: CardSim,
    label: 'Мои услуги',
    url: navigationRoutes[2].path,
  },
  { icon: MessageCircle, label: 'Чаты', url: navigationRoutes[3].path },
];
