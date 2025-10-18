import { motion } from 'framer-motion';
import { ChevronRightSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { changeActivePage, type activePageType } from '@/redux-rtk/store/active-page';

import type { Rows } from '../types';
import './side-bar.scss';

interface props {
  rows: Rows;
}
export const SideBar: React.FC<props> = ({ rows }: props) => {
  const dispatch = useAppDispatch();

  const { activePage } = useAppSelector((state) => state.activePageReducer);
  const navigate = useNavigate();

  const go = (path: string, active: activePageType) => {
    dispatch(changeActivePage({ activePage: active }));
    navigate(path);
  };

  const [isCollapsed, setCollapsed] = useState(true);

  const cls = useMemo(
    () => `SideBar ${isCollapsed ? 'SideBar--collapsed' : 'SideBar--expanded'}`,
    [isCollapsed],
  );

  return (
    <motion.aside
      className={cls}
      /* ширина и лёгкий слайд — приятнее */
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
        {/* Верхняя кнопка */}
        <div className="SideBar__gr1">
          <div
            className="row"
            role="button"
            aria-label="Переключить боковую панель"
            onClick={() => setCollapsed((v) => !v)}
          >
            <motion.span
              style={{ display: 'inline-flex' }}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <ChevronRightSquare />
            </motion.span>

            <span className="row__label">Закрыть боковую панель</span>
          </div>
        </div>

        {/* Нижние пункты — фиксированная высота строк, без прыжков */}
        <div className="SideBar__gr2">
          {rows.map(({ icon: Icon, label, url }, index) => (
            <div
              className={index === activePage ? 'active row ' : 'row'}
              key={label}
              onClick={() => go(url, index)}
            >
              <Icon />
              <span className="row__label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};
