import { ChevronDown, LogOut, Star, User, ClipboardList, Wrench, Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { logoutUser } from '@/redux-rtk/store/auth/authThunks';
import './profile-badge.scss';

const makeInitials = (name?: string, surname?: string, email?: string) => {
  const first = name?.trim()?.[0];
  const last = surname?.trim()?.[0];
  if (first || last) {
    return `${first ?? ''}${last ?? ''}`.toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? 'U';
};

export const ProfileBadge = () => {
  const { user, isAuthenticated } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = useMemo(
    () => makeInitials(user?.name, user?.surname, user?.email),
    [user?.email, user?.name, user?.surname],
  );

  const items = [
    { label: 'Профиль', icon: User, path: '/profile' },
    { label: 'Избранное', icon: Heart, path: '/favorites' },
    { label: 'Мои услуги', icon: Wrench, path: '/my-services' },
    { label: 'Мои заказы', icon: ClipboardList, path: '/my-orders' },
    { label: 'Мои отзывы', icon: Star, path: '/my-reviews' },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setOpen(false);
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-badge">
      <button className="profile-badge__trigger" onClick={() => setOpen((v) => !v)}>
        <div className="profile-badge__avatar">{initials}</div>
        <div className="profile-badge__name">{user.name || user.email}</div>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="profile-badge__dropdown">
          {items.map(({ label, icon: Icon, path }) => (
            <button className="profile-badge__item" key={path} onClick={() => handleNavigate(path)}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
          <button
            className="profile-badge__item profile-badge__item--danger"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
};
