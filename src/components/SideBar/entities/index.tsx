import { CardSim, Diff, MessageCircle, UserRound } from 'lucide-react';

import type { NavItems } from '../types';

export const NAV_ITEMS: NavItems = [
  { icon: Diff, label: 'Мои заказы', url: 'my-orders' },
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
];
