import { createBrowserRouter } from 'react-router-dom';

import { NAV_ITEMS } from '@/components/SideBar/entities';
import { Wrapper } from '@/components/Wrapper';
import { MyServicesPage } from '@/pages/MyServicesPage';

import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />, // общая обёртка с меню
    children: [
      { index: true, element: <HomePage /> },
      { path: NAV_ITEMS[0].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[1].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[2].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[3].url, element: <MyServicesPage /> },
    ],
  },
]);
