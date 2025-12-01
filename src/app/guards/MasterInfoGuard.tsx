import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { fetchOwnProfile } from '@/redux-rtk/store/profile/profileThunks';

const hasMasterInfo = (profile: {
  masterInfo?: { description?: string; phoneNumber?: string };
  skills?: unknown[];
}) =>
  Boolean(profile?.masterInfo?.description) &&
  Array.isArray(profile?.skills) &&
  profile.skills.length > 0 &&
  Boolean(profile?.masterInfo?.phoneNumber);

export const MasterInfoGuard = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuthState);
  const profileState = useAppSelector((state) => state.profile);
  const { data: profile, status } = profileState;

  useEffect(() => {
    if (isAuthenticated && !profile && status === 'idle') {
      dispatch(fetchOwnProfile());
    }
  }, [dispatch, isAuthenticated, profile, status]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (location.pathname.startsWith('/welcome')) {
    return <Outlet />;
  }

  if ((status === 'idle' || status === 'loading') && !profile) {
    return null;
  }

  const ready = profile && hasMasterInfo(profile);

  if (!ready) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
