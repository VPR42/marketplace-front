import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading } from 'rsuite';

import { AuthModal } from '@/components/AuthModals';
import { Ivan } from '@/shared/icons/ivan/Ivan';

import './header.scss';

export const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  return (
    <>
      <AuthModal open={isModalOpen} onClose={handleClose} />
      <header className="header">
        <Link to="/" className="header__logo">
          <Ivan width={32} height={32} />
          <Heading level={4}>ServiGO</Heading>
        </Link>
        <div className="header__buttons">
          <Button title="Услуги">
            <Heading level={4} className="servs">
              Услуги
            </Heading>
          </Button>
          <div className="header__buttons__login">
            <Button title="Вход" onClick={() => setModalOpen(true)}>
              <Heading level={4}>Вход</Heading>
            </Button>
            <Heading level={4}>/</Heading>
            <Button title="Регистрация">
              <Heading level={4}>Регистрация</Heading>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};
