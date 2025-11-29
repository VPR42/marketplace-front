import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SideBar } from '@/components/SideBar';
import './wrapper.scss';

export const Wrapper: React.FC = () => (
  <div className="wrapper">
    <SideBar />
    <div className="wrapper__maincont">
      <Header />
      <main className="wrapper__content">
        {' '}
        {/* чтобы футер прижать добавил тут да */}
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);
