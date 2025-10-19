/* eslint-disable prettier/prettier */

import { Link } from 'react-router-dom';
import { Button, Checkbox, Input, Modal } from 'rsuite';
import './auth-modals.scss';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} className="auth-modal">
    <Modal.Header className="auth-modal__header">
      <Modal.Title>Вход в аккаунт</Modal.Title>
    </Modal.Header>
    <Modal.Body className="auth-modal__body">
      <div className="input-block">
        <label className="input-label" htmlFor="email">
          Электронная почта
        </label>
        <Input id="email" placeholder="Ваш email..." className="input" />
      </div>

      <div className="input-block">
        <label className="input-label" htmlFor="password">
          Пароль
        </label>
        <Input placeholder="Ваш пароль..." type="password" />
      </div>

      <div className="remember">
        <Checkbox>
          <span>Запомнить меня</span>
        </Checkbox>
        <Link to="/" aria-label="Забыли пароль?" className="link">
          Забыли пароль?
        </Link>
      </div>
    </Modal.Body>
    <Modal.Footer className="auth-modal__footer">
      <Button appearance="subtle" onClick={onClose}>
        Отмена
      </Button>
      <Button appearance="primary" onClick={onClose} className="login-button">
        Войти
      </Button>
    </Modal.Footer>
  </Modal>
);

export const RegisterModal: React.FC<AuthModalProps> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} className="auth-modal" overflow={false}>
    <Modal.Header className="auth-modal__header">
      <Modal.Title>Регистрация</Modal.Title>
    </Modal.Header>
    <Modal.Body className="auth-modal__body">
      <div className="fio-block">
        <div className="input-block">
          <label className="input-label" htmlFor="name">
            Имя
          </label>
          <Input id="name" placeholder="Ваше имя" className="input" />
        </div>

        <div className="input-block">
          <label className="input-label" htmlFor="surname">
            Фамилия
          </label>
          <Input id="surname" placeholder="Ваша фамилия" className="input" />
        </div>
      </div>

      <div className="input-block">
        <label className="input-label" htmlFor="email">
          Электронная почта
        </label>
        <Input id="email" placeholder="Ваш email..." className="input" />
      </div>

      <div className="input-block">
        <label className="input-label" htmlFor="password">
          Пароль
        </label>
        <Input id="password" placeholder="Ваш пароль..." type="password" />
      </div>

      <div className="input-block">
        <label className="input-label" htmlFor="password-repeat">
          Повторите пароль
        </label>
        <Input id="password-repeat" placeholder="Ваш пароль..." type="password" />
      </div>

      <div className="remember">
        <Checkbox>
          <span>Запомнить меня</span>
        </Checkbox>
        <Link to="/" aria-label="Забыли пароль?" className="link">
          Забыли пароль?
        </Link>
      </div>

      <div className="sogl">
        <Checkbox>
          <span>
            Согласен с условиями{' '}
            <a className="link" href="/">
              соглашения
            </a>
          </span>
        </Checkbox>
      </div>
    </Modal.Body>
    <Modal.Footer className="auth-modal__footer">
      <Button appearance="subtle" onClick={onClose}>
        Отмена
      </Button>
      <Button appearance="primary" onClick={onClose} className="login-button">
        Создать аккаунт
      </Button>
    </Modal.Footer>
  </Modal>
);
