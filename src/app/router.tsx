import { createBrowserRouter } from 'react-router-dom';

import { Wrapper } from '@/components/Wrapper';
import { ChatsPage } from '@/pages/ChatsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { LandingPage } from '@/pages/LandingPage';
import { MyOrdersPage } from '@/pages/MyOrdersPage';
import { MyServicesPage } from '@/pages/MyServicesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ServiceCatalogPage } from '@/pages/ServiceCatalogPage';
import { WelcomePage } from '@/pages/WelcomePage/ui';

import { MasterInfoGuard } from './guards/MasterInfoGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />,
    children: [
      { path: '/welcome', element: <WelcomePage /> },
      {
        element: <MasterInfoGuard />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: '/feed', element: <ServiceCatalogPage /> },
          { path: '/favorites', element: <FavoritesPage /> },
          { path: '/my-services', element: <MyServicesPage /> },
          { path: '/my-orders', element: <MyOrdersPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/:userId', element: <ProfilePage /> },
          { path: '/chats', element: <ChatsPage /> },
        ],
      },
    ],
  },
]);
