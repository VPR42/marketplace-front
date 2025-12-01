import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/redux-rtk/hooks';

export const AuthGuard = () => {
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
