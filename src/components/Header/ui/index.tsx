import { Button, Heading } from 'rsuite';

import { Ivan } from '@/shared/icons/ivan/Ivan';
import './header.scss';

export const Header = () => (
  <header className="header">
    <div className="header__logo">
      <Ivan width={32} height={32} />
      <Heading level={4}>ServiGO</Heading>
    </div>
    <div className="header__buttons">
      <Button title="Услуги">
        <Heading level={4} className="servs">
          Услуги
        </Heading>
      </Button>
      <div className="header__buttons__login">
        <Button title="Вход">
          <Heading level={4}>Вход</Heading>
        </Button>
        <Heading level={4}>/</Heading>
        <Button title="Регистрация">
          <Heading level={4}>Регистрация</Heading>
        </Button>
      </div>
    </div>
  </header>
);
