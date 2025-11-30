import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Modal,
  SelectPicker,
  TagPicker,
  Uploader,
} from 'rsuite';

import { cities } from '@/shared/data/cities';

import './edit-user-profile.scss';

export interface EditUserProfileForm {
  name: string;
  surname: string;
  patronymic: string;
  pseudonym: string;
  phone: string;
  city: number | null;
  about: string;
  description: string;
  experience: number;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  skills: number[];
  avatarUrl?: string;
}

interface EditUserProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<EditUserProfileForm>;
  skillsOptions?: { id: number; name: string }[];
  onSubmit?: (form: EditUserProfileForm) => void;
}

const defaultForm: EditUserProfileForm = {
  name: '',
  surname: '',
  patronymic: '',
  pseudonym: '',
  phone: '',
  city: null,
  about: '',
  description: '',
  experience: 0,
  daysOfWeek: [],
  startTime: '',
  endTime: '',
  skills: [],
  avatarUrl: '',
};

const dayOptions = [
  { label: 'Пн', value: 0 },
  { label: 'Вт', value: 1 },
  { label: 'Ср', value: 2 },
  { label: 'Чт', value: 3 },
  { label: 'Пт', value: 4 },
  { label: 'Сб', value: 5 },
  { label: 'Вс', value: 6 },
];

export const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({
  open,
  onClose,
  initialValues,
  skillsOptions = [],
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

  const handlePhoneChange = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    handleChange('phone', numeric);
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

    const checkLength = (
      value: string,
      field: keyof EditUserProfileForm,
      min: number,
      max: number,
    ) => {
      if (!value.trim()) {
        nextErrors[field] = 'Поле обязательно';
        return;
      }
      if (value.trim().length < min || value.trim().length > max) {
        nextErrors[field] = `От ${min} до ${max} символов`;
      }
    };

    checkLength(form.name, 'name', 2, 20);
    checkLength(form.surname, 'surname', 2, 20);
    checkLength(form.patronymic, 'patronymic', 2, 20);
    checkLength(form.pseudonym, 'pseudonym', 2, 20);

    if (!form.city) {
      nextErrors.city = 'Укажите город';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Укажите телефон';
    } else if (!/^\d{10,15}$/.test(form.phone)) {
      nextErrors.phone = 'Только цифры, 10-15 символов';
    }

    if (!form.startTime.trim() || !form.endTime.trim()) {
      nextErrors.startTime = 'Укажите время работы';
    }

    if (!form.about.trim() || form.about.length < 10 || form.about.length > 200) {
      nextErrors.about = 'О себе: от 10 до 200 символов';
    }

    if (!form.skills.length) {
      nextErrors.skills = 'Выберите навыки';
    }

    if (!form.daysOfWeek.length) {
      nextErrors.daysOfWeek = 'Выберите дни недели';
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

  const mappedSkillsOptions = useMemo(
    () => skillsOptions.map((skill) => ({ label: skill.name, value: skill.id })),
    [skillsOptions],
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
              action="#"
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
              placeholder="Фамилия"
              onChange={(value) => handleChange('surname', value)}
            />
            {errors.surname ? <span className="input-error-text">{errors.surname}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="name">Имя</label>
            <Input
              id="name"
              value={form.name}
              placeholder="Имя"
              onChange={(value) => handleChange('name', value)}
            />
            {errors.name ? <span className="input-error-text">{errors.name}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="patronymic">Отчество</label>
            <Input
              id="patronymic"
              value={form.patronymic}
              placeholder="Отчество"
              onChange={(value) => handleChange('patronymic', value)}
            />
            {errors.patronymic ? (
              <span className="input-error-text">{errors.patronymic}</span>
            ) : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="pseudonym">Псевдоним</label>
            <Input
              id="pseudonym"
              value={form.pseudonym}
              placeholder="Псевдоним"
              onChange={(value) => handleChange('pseudonym', value)}
            />
            {errors.pseudonym ? <span className="input-error-text">{errors.pseudonym}</span> : null}
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
            <label htmlFor="phone">Телефон</label>
            <Input
              id="phone"
              value={form.phone}
              placeholder="79991234567"
              onChange={handlePhoneChange}
            />
            {errors.phone ? <span className="input-error-text">{errors.phone}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="experience">Опыт (лет)</label>
            <InputNumber
              id="experience"
              value={form.experience}
              onChange={(value) => handleChange('experience', Number(value) || 0)}
              min={0}
              className="edit-profile-modal__number-input"
            />
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="description">Краткая информация</label>
            <Input
              id="description"
              value={form.description}
              placeholder="Опишите специализацию"
              onChange={(value) => handleChange('description', value)}
            />
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="about">О себе</label>
            <Input
              id="about"
              as="textarea"
              rows={4}
              value={form.about}
              placeholder="Расскажите о себе"
              onChange={(value) => handleChange('about', value)}
            />
            {errors.about ? <span className="input-error-text">{errors.about}</span> : null}
          </div>

          <div className="edit-profile-modal__field edit-profile-modal__time">
            <div>
              <label htmlFor="startTime">Начало работы</label>
              <Input
                id="startTime"
                value={form.startTime}
                placeholder="09:00"
                onChange={(value) => handleChange('startTime', value)}
              />
            </div>
            <div>
              <label htmlFor="endTime">Окончание</label>
              <Input
                id="endTime"
                value={form.endTime}
                placeholder="20:00"
                onChange={(value) => handleChange('endTime', value)}
              />
            </div>
            {errors.startTime ? <span className="input-error-text">{errors.startTime}</span> : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="daysOfWeek">Дни работы</label>
            <TagPicker
              id="daysOfWeek"
              data={dayOptions}
              value={form.daysOfWeek}
              onChange={(value) => handleChange('daysOfWeek', value ?? [])}
              placeholder="Выберите дни"
              block
            />
            {errors.daysOfWeek ? (
              <span className="input-error-text">{errors.daysOfWeek}</span>
            ) : null}
          </div>

          <div className="edit-profile-modal__field">
            <label htmlFor="skills">Навыки и направления</label>
            <TagPicker
              id="skills"
              data={mappedSkillsOptions}
              value={form.skills}
              onChange={(value) => handleChange('skills', value ?? [])}
              placeholder="Выберите навыки"
              block
            />
            {errors.skills ? <span className="input-error-text">{errors.skills}</span> : null}
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
