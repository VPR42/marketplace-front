import { createBrowserRouter } from 'react-router-dom';

import { NAV_ITEMS } from '@/components/SideBar/entities';
import { Wrapper } from '@/components/Wrapper';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { LandingPage } from '@/pages/LandingPage';
import { MyOrdersPage } from '@/pages/MyOrdersPage';
import { MyServicesPage } from '@/pages/MyServicesPage';
import { ServiceCatalogPage } from '@/pages/ServiceCatalogPage/ui';

import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />, // общая обёртка с меню
    children: [
      { index: true, element: <HomePage /> },
      { path: NAV_ITEMS[0].url, element: <LandingPage /> },
      { path: NAV_ITEMS[1].url, element: <ServiceCatalogPage /> },
      { path: NAV_ITEMS[2].url, element: <MyOrdersPage /> },
      { path: NAV_ITEMS[3].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[4].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[5].url, element: <MyServicesPage /> },
      { path: NAV_ITEMS[6].url, element: <FavoritesPage /> },
    ],
  },
]);
