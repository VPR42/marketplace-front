import { motion } from 'framer-motion';
import {
  BotMessageSquare,
  ChartNetwork,
  ChevronRightSquare,
  LineChartIcon,
  NotepadText,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './side-bar.scss';

export const SideBar: React.FC = () => {
  const navigationRoutes = {
    home: '/',
    scenarioPage: 'scenario',
    aiChatbotPage: 'ai',
    paymentsPage: 'payments',
  };

  const ROWS = [
    { icon: LineChartIcon, label: 'Аналитика', url: navigationRoutes.home },
    {
      icon: ChartNetwork,
      label: 'Сценарная аналитика',
      url: navigationRoutes.scenarioPage,
    },
    {
      icon: BotMessageSquare,
      label: 'ИИ-ассистент',
      url: navigationRoutes.aiChatbotPage,
    },
    { icon: NotepadText, label: 'Платежи', url: navigationRoutes.paymentsPage },
  ];

  const navigate = useNavigate();

  const go = (path: string) => {
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
          {ROWS.map(({ icon: Icon, label, url }) => (
            <div className={'row'} key={label} onClick={() => go(url)}>
              <Icon />
              <span className="row__label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};
