import { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Input, Modal, SelectPicker, TagPicker, Uploader } from 'rsuite';

import { cities } from '@/shared/data/cities';

import './edit-user-profile.scss';

const skillOptions = [
  { label: 'Электроника', value: 'electronics' },
  { label: 'Уборка', value: 'cleaning' },
  { label: 'Мелкий ремонт', value: 'small-repair' },
  { label: 'Сантехника', value: 'plumbing' },
  { label: 'IT-услуги', value: 'it-services' },
  { label: 'Кондиционеры', value: 'air-conditioning' },
  { label: 'Сборка мебели', value: 'furniture' },
];

export interface EditUserProfileForm {
  name: string;
  surname: string;
  patronymic: string;
  nickname: string;
  phone: string;
  city: number | null;
  about: string;
  workingHours: string;
  skills: string[];
  avatarUrl?: string;
}

interface EditUserProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<EditUserProfileForm>;
  onSubmit?: (form: EditUserProfileForm) => void;
}

const defaultForm: EditUserProfileForm = {
  name: '',
  surname: '',
  patronymic: '',
  nickname: '',
  phone: '',
  city: null,
  about: '',
  workingHours: '',
  skills: [],
  avatarUrl: '',
};

export const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  const [form, setForm] = useState<EditUserProfileForm>({ ...defaultForm, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof EditUserProfileForm, string>>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialValues?.avatarUrl);

  useEffect(() => {
    if (open) {
      setForm({ ...defaultForm, ...initialValues });
      setAvatarPreview(initialValues?.avatarUrl);
      setErrors({});
    }
  }, [open, initialValues]);

  useEffect(
    () => () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    },
    [avatarPreview],
  );

  const handleChange = <T extends keyof EditUserProfileForm>(
    field: T,
    value: EditUserProfileForm[T],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarUpload = (
    fileList: Parameters<NonNullable<React.ComponentProps<typeof Uploader>['onChange']>>[0],
  ) => {
    const file = fileList.at(-1);
    if (file?.blobFile) {
      const url = URL.createObjectURL(file.blobFile);
      setAvatarPreview((prev) => {
        if (prev?.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return url;
      });
      handleChange('avatarUrl', url);
    }
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(undefined);
    handleChange('avatarUrl', '');
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof EditUserProfileForm, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Укажите имя';
    }
    if (!form.surname.trim()) {
      nextErrors.surname = 'Укажите фамилию';
    }
    if (!form.city) {
      nextErrors.city = 'Выберите город';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Введите номер телефона';
    }
    if (!form.workingHours.trim()) {
      nextErrors.workingHours = 'Укажите рабочие часы';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit?.(form);
    onClose();
  };

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        label: city.label,
        value: city.value,
      })),
    [],
  );

  return (
    <Modal open={open} onClose={onClose} className="edit-profile-modal" size="md" overflow={false}>
      <Modal.Header>
        <Modal.Title>Редактирование профиля</Modal.Title>
      </Modal.Header>

      <Modal.Body className="edit-profile-modal__body">
        <div className="edit-profile-modal__avatar-block">
          <Avatar size="lg" circle src={avatarPreview} className="edit-profile-modal__avatar">
            {!avatarPreview && `${form.name.slice(0, 1)}${form.surname.slice(0, 1)}`.toUpperCase()}
          </Avatar>
          <div className="edit-profile-modal__avatar-actions">
            <Uploader
              fileListVisible={false}
              autoUpload={false}
              multiple={false}
              onChange={handleAvatarUpload}
            >
              <Button appearance="primary" size="sm">
                Загрузить фото
              </Button>
            </Uploader>
            {avatarPreview ? (
              <Button appearance="subtle" size="sm" onClick={handleRemoveAvatar}>
                Удалить
              </Button>
            ) : null}
          </div>
        </div>

        <div className="edit-profile-modal__fields">
          <div className="edit-profile-modal__field">
            <label htmlFor="surname">Фамилия</label>
            <Input
              id="surname"
              value={form.surname}
              placeholder="Иванов"
              onChange={(value) => handleChange('surname', value)}
            />
            {errors.surname ? <span className="input-error-text">{errors.surname}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="name">Имя</label>
            <Input
              id="name"
              value={form.name}
              placeholder="Иван"
              onChange={(value) => handleChange('name', value)}
            />
            {errors.name ? <span className="input-error-text">{errors.name}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="patronymic">Отчество</label>
            <Input
              id="patronymic"
              value={form.patronymic}
              placeholder="Иванович"
              onChange={(value) => handleChange('patronymic', value)}
            />
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="nickname">Псевдоним</label>
            <Input
              id="nickname"
              value={form.nickname}
              placeholder="Например, Мастер Иван"
              onChange={(value) => handleChange('nickname', value)}
            />
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="city">Город работы</label>
            <SelectPicker
              id="city"
              data={cityOptions}
              placeholder="Выберите город"
              value={form.city}
              onChange={(value) => handleChange('city', typeof value === 'number' ? value : null)}
              block
              searchable
              className={errors.city ? 'picker-error' : undefined}
            />
            {errors.city ? <span className="input-error-text">{errors.city}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="phone">Номер телефона</label>
            <Input
              id="phone"
              value={form.phone}
              placeholder="+7 (___) ___-__-__"
              onChange={(value) => handleChange('phone', value)}
            />
            {errors.phone ? <span className="input-error-text">{errors.phone}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="workingHours">Рабочие часы</label>
            <Input
              id="workingHours"
              value={form.workingHours}
              placeholder="Пн-Пт 09:00-20:00"
              onChange={(value) => handleChange('workingHours', value)}
            />
            {errors.workingHours ? (
              <span className="input-error-text">{errors.workingHours}</span>
            ) : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="about">О себе</label>
            <Input
              id="about"
              as="textarea"
              rows={4}
              value={form.about}
              placeholder="Расскажите о своём опыте и подходе"
              onChange={(value) => handleChange('about', value)}
            />
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="skills">Навыки и направления</label>
            <TagPicker
              id="skills"
              data={skillOptions}
              value={form.skills}
              onChange={(value) => handleChange('skills', value ?? [])}
              placeholder="Выберите навыки"
              block
              searchable={false}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="edit-profile-modal__footer">
        <Button appearance="subtle" onClick={onClose}>
          Отмена
        </Button>
        <Button
          appearance="primary"
          onClick={handleSubmit}
          className="edit-profile-modal__save-btn"
        >
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
