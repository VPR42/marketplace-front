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
        <Input id="email" placeholder="Введите ваш email" className="input" />
      </div>
      <div className="input-block">
        <label className="input-label" htmlFor="password">
          Пароль
        </label>
        <Input placeholder="Введите ваш пароль" type="password" />
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
