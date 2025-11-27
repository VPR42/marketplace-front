import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Modal, SelectPicker } from 'rsuite';
import zxcvbn from 'zxcvbn';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { loginUser, registerUser } from '@/redux-rtk/store/auth/authThunks';
import { cities } from '@/shared/data/cities';
import { InputField } from '@/shared/InputField';
import './auth-modals.scss';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const authInitialState = { email: '', password: '' };
const registerInitialState = {
  name: '',
  surname: '',
  patronymic: '',
  email: '',
  city: null as number | null,
  password: '',
  confirmPassword: '',
  agree: false,
};

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_NAME = 50;
const MAX_EMAIL = 100;
const MAX_PASSWORD = 64;

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuthState);

  const [form, setForm] = useState(authInitialState);
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({});

  const clearFieldError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        submit: field === 'submit' ? undefined : prev.submit,
      }));
    }
  };

  useEffect(() => {
    if (!open) {
      setForm(authInitialState);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) {
      newErrors.email = 'Почта обязательна';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Некорректная почта';
    } else if (form.email.length > MAX_EMAIL) {
      newErrors.email = `Максимум ${MAX_EMAIL} символов`;
    }

    if (!form.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (form.password.length > MAX_PASSWORD) {
      newErrors.password = `Максимум ${MAX_PASSWORD} символов`;
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      handleClose();
    } catch (error) {
      setErrors({ submit: (error as string) || 'Не удалось войти' });
    }
  };

  const handleClose = () => {
    setForm(authInitialState);
    setErrors({});
    onClose();
  };

  const isLoading = status === 'loading';

  return (
    <Modal open={open} onClose={handleClose} className="auth-modal">
      <Modal.Header className="auth-modal__header">
        <Modal.Title>Вход в аккаунт</Modal.Title>
      </Modal.Header>
      <Modal.Body className="auth-modal__body">
        <InputField
          name="email"
          label="Почта"
          placeholder="Введите почту..."
          value={form.email}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, email: v }));
            clearFieldError('email');
          }}
          error={errors.email}
        />

        <InputField
          name="password"
          label="Пароль"
          placeholder="Введите пароль..."
          isPassword
          value={form.password}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, password: v }));
            clearFieldError('password');
          }}
          error={errors.password}
        />

        <div className="remember">
          <Checkbox>
            <span>Запомнить меня</span>
          </Checkbox>
          <Link to="/" aria-label="Забыли пароль?" className="link">
            Забыли пароль?
          </Link>
        </div>
        {errors.submit ? <div className="form-error">{errors.submit}</div> : null}
      </Modal.Body>
      <Modal.Footer className="auth-modal__footer">
        <Button appearance="subtle" onClick={handleClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          appearance="primary"
          onClick={handleSubmit}
          className="login-button"
          loading={isLoading}
          disabled={isLoading}
        >
          Войти
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

type RegisterErrors = Partial<{
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  city: string;
  password: string;
  confirmPassword: string;
  agree: string;
  submit: string;
}>;

export const RegisterModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuthState);

  const [form, setForm] = useState(registerInitialState);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const passwordScore = useMemo(() => zxcvbn(form.password).score, [form.password]);

  const clearFieldError = (field: keyof RegisterErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        submit: field === 'submit' ? undefined : prev.submit,
      }));
    }
  };

  useEffect(() => {
    if (!open) {
      setForm(registerInitialState);
      setErrors({});
    }
  }, [open]);

  const validate = (): RegisterErrors => {
    const newErrors: RegisterErrors = {};
    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Имя от 2 символов';
    } else if (form.name.trim().length > MAX_NAME) {
      newErrors.name = `Максимум ${MAX_NAME} символов`;
    }
    if (!form.surname || form.surname.trim().length < 2) {
      newErrors.surname = 'Фамилия от 2 символов';
    } else if (form.surname.trim().length > MAX_NAME) {
      newErrors.surname = `Максимум ${MAX_NAME} символов`;
    }
    if (!form.patronymic || form.patronymic.trim().length < 3) {
      newErrors.patronymic = 'Отчество от 3 символов';
    } else if (form.patronymic.trim().length > MAX_NAME) {
      newErrors.patronymic = `Максимум ${MAX_NAME} символов`;
    }
    if (!form.email) {
      newErrors.email = 'Почта обязательна';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Некорректная почта';
    } else if (form.email.length > MAX_EMAIL) {
      newErrors.email = `Максимум ${MAX_EMAIL} символов`;
    }
    if (form.city === null) {
      newErrors.city = 'Выберите город';
    }
    if (!form.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (passwordScore < 2) {
      newErrors.password = 'Пароль слишком слабый';
    } else if (form.password.length > MAX_PASSWORD) {
      newErrors.password = `Максимум ${MAX_PASSWORD} символов`;
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Повторите пароль';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!form.agree) {
      newErrors.agree = 'Нужно согласиться с условиями';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await dispatch(
        registerUser({
          name: form.name.trim(),
          surname: form.surname.trim(),
          patronymic: form.patronymic.trim(),
          email: form.email.trim(),
          password: form.password,
          city: form.city ?? 0,
        }),
      ).unwrap();
      handleClose();
    } catch (error) {
      setErrors({ submit: (error as string) || 'Не удалось зарегистрироваться' });
    }
  };

  const handleClose = () => {
    setForm(registerInitialState);
    setErrors({});
    onClose();
  };

  const isLoading = status === 'loading';

  return (
    <Modal open={open} onClose={handleClose} className="auth-modal" overflow={false}>
      <Modal.Header className="auth-modal__header">
        <Modal.Title>Регистрация</Modal.Title>
      </Modal.Header>
      <Modal.Body className="auth-modal__body">
        <div className="fio-block">
          <InputField
            name="name"
            label="Имя"
            placeholder="Иван"
            value={form.name}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, name: v }));
              clearFieldError('name');
            }}
            error={errors.name}
          />

          <InputField
            name="surname"
            label="Фамилия"
            placeholder="Иванов"
            value={form.surname}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, surname: v }));
              clearFieldError('surname');
            }}
            error={errors.surname}
          />

          <InputField
            name="patronymic"
            label="Отчество"
            placeholder="Иванович"
            value={form.patronymic}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, patronymic: v }));
              clearFieldError('patronymic');
            }}
            error={errors.patronymic}
          />
        </div>

        <InputField
          name="email"
          label="Почта"
          placeholder="tutuvania2004@zov.ru"
          value={form.email}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, email: v }));
            clearFieldError('email');
          }}
          error={errors.email}
        />

        <div className="city-block">
          <label className="input-label" htmlFor="city">
            Город
          </label>
          <SelectPicker
            id="city"
            data={cities}
            value={form.city}
            onChange={(value, _event) => {
              setForm((prev) => ({ ...prev, city: typeof value === 'number' ? value : null }));
              clearFieldError('city');
            }}
            placeholder="Выберите город"
            block
            searchable
            className={errors.city ? 'city-picker picker-error' : 'city-picker'}
          />
          {errors.city ? <span className="input-error-text">{errors.city}</span> : null}
        </div>

        <InputField
          name="password"
          label="Пароль"
          placeholder="IvanSexyBeast2004Vpr12Pasholko!!!"
          isPassword
          showStrengthBar
          value={form.password}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, password: v }));
            clearFieldError('password');
          }}
          error={errors.password}
        />

        <InputField
          name="confirmPassword"
          label="Подтвердите пароль"
          placeholder="IvanSexyBeast2004Vpr12Pasholko!!!"
          isPassword
          value={form.confirmPassword}
          onChange={(v) => {
            setForm((prev) => ({ ...prev, confirmPassword: v }));
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
        />

        <div className="remember">
          <Checkbox
            checked={form.agree}
            onChange={(_value, checked) => {
              setForm((prev) => ({ ...prev, agree: Boolean(checked) }));
              clearFieldError('agree');
            }}
          >
            <span>Согласен с условиями сервиса</span>
          </Checkbox>
        </div>
        {errors.agree ? <span className="input-error-text">{errors.agree}</span> : null}

        {errors.submit ? <div className="form-error">{errors.submit}</div> : null}
      </Modal.Body>
      <Modal.Footer className="auth-modal__footer">
        <Button appearance="subtle" onClick={handleClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          appearance="primary"
          onClick={handleSubmit}
          className="login-button"
          loading={isLoading}
          disabled={isLoading}
        >
          Зарегистрироваться
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
