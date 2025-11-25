import { Link } from 'react-router-dom';
import { Button, Checkbox, Modal } from 'rsuite';

import { InputField } from '@/shared/InputField';
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
      <InputField name={'email'} label={'Электронная почта'} placeholder="Ваша почта..." />

      <InputField name={'password'} label={'Пароль'} placeholder="Ваш пароль..." isPassword />

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
        <InputField name={'name'} label={'Имя'} placeholder="Иван" />

        <InputField name={'surname'} label={'Фамилия'} placeholder="Говнов" />
      </div>

      <InputField name={'email'} label={'Электронная почта'} placeholder="tutuvania2004@zov.ru" />

      <InputField
        name={'password'}
        label={'Пароль'}
        placeholder="IvanSexyBeast2004Vpr12Pasholko!!!"
        isPassword
        showStrengthBar
      />

      <InputField
        name={'password'}
        label={'Повторите пароль'}
        placeholder="IvanSexyBeast2004Vpr12Pasholko!!!"
        isPassword
      />

      <div className="remember">
        <Checkbox>
          <span>Запомнить меня</span>
        </Checkbox>
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
