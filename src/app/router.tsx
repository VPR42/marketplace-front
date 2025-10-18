import { createBrowserRouter } from 'react-router-dom';

import { navigationRoutes } from '@/components/SideBar/entities';
import { Wrapper } from '@/components/Wrapper';
import { MyServicesPage } from '@/pages/MyServicesPage';

import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />, // общая обёртка с меню
    children: [
      { index: true, element: <HomePage /> },
      { path: navigationRoutes[0].name, element: <MyServicesPage /> },
      { path: navigationRoutes[1].name, element: <MyServicesPage /> },
      { path: navigationRoutes[2].name, element: <MyServicesPage /> },
      { path: navigationRoutes[3].name, element: <MyServicesPage /> },
    ],
  },
]);
