
import { createBrowserRouter } from 'react-router-dom';

import { Wrapper } from '@/components/Wrapper';
import { ChatsPage } from '@/pages/ChatsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { MyOrdersPage } from '@/pages/MyOrdersPage';
import { MyReviewsPage } from '@/pages/MyReviewsPage';
import { MyServicesPage } from '@/pages/MyServicesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ServiceCatalogPage } from '@/pages/ServiceCatalogPage/ui';

import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />, // общая обёртка с меню
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/feed', element: <ServiceCatalogPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/my-services', element: <MyServicesPage /> },
      { path: '/my-orders', element: <MyOrdersPage /> },
      { path: '/my-reviews', element: <MyReviewsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/chats', element: <ChatsPage /> },
    ],
  },
]);

