import React from 'react';
import { Outlet } from 'react-router-dom';

import './wrapper.scss';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const Wrapper: React.FC = () => (
  <div className="wrapper">
    <Header />
    <Outlet />
    <Footer />
  </div>
);
