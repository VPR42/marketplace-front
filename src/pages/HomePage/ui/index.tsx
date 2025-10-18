import { Content } from 'rsuite';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import './HomePage.scss';

export const HomePage = () => (
  <div className="homepage-container">
    <Header />
    <Content>Золо</Content>
    <Footer />
  </div>
);
