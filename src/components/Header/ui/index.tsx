import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Heading } from 'rsuite';

import { AuthModal, RegisterModal } from '@/components/AuthModals';
import { ProfileBadge } from '@/components/ProfileBadge';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { fetchWhoAmI, getStoredToken } from '@/redux-rtk/store/auth/authThunks';

import './header.scss';

export const Header = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isRegModalOpen, setRegModalOpen] = useState(false);
  const handleAuthClose = () => setAuthModalOpen(false);
  const handleRegClose = () => setRegModalOpen(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const whoAmIFetched = useRef(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token && !whoAmIFetched.current) {
      whoAmIFetched.current = true;
      dispatch(fetchWhoAmI());
    }
  }, [dispatch]);

  return (
    <>
      <AuthModal open={isAuthModalOpen} onClose={handleAuthClose} />
      <RegisterModal open={isRegModalOpen} onClose={handleRegClose} />
      <header className="header">
        <Link to="/" className="header__logo">
          <img className="header__logo-img" src="/main_logo.png" />
        </Link>
        <div className="header__buttons">
          <Button title="Лента" onClick={() => navigate('/feed')}>
            <Heading level={4} className="servs">
              Лента
            </Heading>
          </Button>
          {isAuthenticated ? (
            <ProfileBadge />
          ) : (
            <div className="header__buttons__login">
              <Button title="Вход" onClick={() => setAuthModalOpen(true)}>
                <Heading level={4}>Вход</Heading>
              </Button>
              <Heading level={4}>/</Heading>
              <Button title="Регистрация" onClick={() => setRegModalOpen(true)}>
                <Heading level={4}>Регистрация</Heading>
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
