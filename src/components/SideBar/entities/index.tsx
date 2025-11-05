import { CardSim, MessageCircle, UserRound, LayoutDashboard, ClipboardList } from 'lucide-react';

import type { NavItems } from '../types';

export const NAV_ITEMS: NavItems = [
  { icon: LayoutDashboard, label: 'Лента', url: 'feed' },
  { icon: ClipboardList, label: 'Мои заказы', url: 'my-orders' },
  {
    icon: UserRound,
    label: 'Профиль',
    url: 'my-profile',
  },
  {
    icon: CardSim,
    label: 'Мои услуги',
    url: 'my-services',
  },
  { icon: MessageCircle, label: 'Чаты', url: 'my-chats' },
  { icon: MessageCircle, label: 'избранное(временно)', url: 'favorites' },
];
