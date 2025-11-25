import { motion } from 'framer-motion';
import { ChevronRightSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from '../entities';

import './side-bar.scss';
import { useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';

export const SideBar: React.FC = () => {
  const [isCollapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAppSelector(selectAuthState);

  const filteredNav = useMemo(
    () => NAV_ITEMS.filter((item) => (item.url === '/chats' ? isAuthenticated : true)),
    [isAuthenticated],
  );

  const cls = useMemo(
    () => `SideBar ${isCollapsed ? 'SideBar--collapsed' : 'SideBar--expanded'}`,
    [isCollapsed],
  );

  return (
    <motion.aside
      className={cls}
      initial={{ x: -16, opacity: 0, width: 64 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? 64 : 288,
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 28,
      }}
    >
      <div className="SideBar__wr">
        <div className="SideBar__gr1">
          <div
            className="row"
            role="button"
            aria-label="Свернуть или развернуть меню"
            onClick={() => setCollapsed((v) => !v)}
          >
            <motion.span
              style={{ display: 'inline-flex' }}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <ChevronRightSquare />
            </motion.span>

            <span className="row__label">Свернуть меню</span>
          </div>
        </div>

        <div className="SideBar__gr2">
          {filteredNav.map(({ icon: Icon, label, url }) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'active row ' : 'row')}
              key={label}
              to={url}
            >
              <Icon />
              <span className="row__label">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};
