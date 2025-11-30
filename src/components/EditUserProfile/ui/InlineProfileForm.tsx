import { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Input, InputNumber, SelectPicker, TagPicker } from 'rsuite';

import { cities } from '@/shared/data/cities';
import { skillsMock } from '@/shared/data/skills';

import type { EditUserProfileForm } from '.';

import './edit-user-profile.scss';

interface InlineProfileFormProps {
  initialValues?: Partial<EditUserProfileForm>;
  skillsOptions?: { id: number; name: string }[];
  onSubmit?: (form: EditUserProfileForm) => void;
  loading?: boolean;
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

export const InlineProfileForm: React.FC<InlineProfileFormProps> = ({
  initialValues,
  skillsOptions = skillsMock,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState<EditUserProfileForm>({ ...defaultForm, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof EditUserProfileForm, string>>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialValues?.avatarUrl);

  useEffect(() => {
    setForm({ ...defaultForm, ...initialValues });
    setAvatarPreview(initialValues?.avatarUrl);
    setErrors({});
  }, [initialValues]);

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

  const formatPhone = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 11);
    const parts = [
      clean.slice(0, 1),
      clean.slice(1, 4),
      clean.slice(4, 7),
      clean.slice(7, 9),
      clean.slice(9, 11),
    ];
    if (!parts[0]) {
      return '';
    }
    const country = `+${parts[0]}`;
    const city = parts[1] ? ` (${parts[1]}${parts[1].length === 3 ? ')' : ''}` : '';
    const first = parts[2] ? ` ${parts[2]}` : '';
    const second = parts[3] ? `-${parts[3]}` : '';
    const third = parts[4] ? `-${parts[4]}` : '';
    return `${country}${city}${first}${second}${third}`;
  };

  const handlePhoneChange = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    handleChange('phone', numeric.slice(0, 11));
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
  };

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        label: city.label,
        value: city.value,
      })),
    [],
  );

  const mappedSkillsOptions = useMemo(() => {
    const source = skillsOptions?.length ? skillsOptions : skillsMock;
    return source.map((skill) => ({ label: skill.name, value: skill.id }));
  }, [skillsOptions]);

  return (
    <div className="inline-profile-form">
      <div className="inline-profile-form__avatar-block">
        <Avatar size="lg" circle src={avatarPreview} className="inline-profile-form__avatar">
          {!avatarPreview && `${form.name.slice(0, 1)}${form.surname.slice(0, 1)}`.toUpperCase()}
        </Avatar>
        <div className="inline-profile-form__avatar-actions">
          <Button appearance="primary" size="sm" className="orange-btn" disabled>
            Загрузить фото (скоро)
          </Button>
        </div>
      </div>

      <div className="inline-profile-form__fields">
        <div className="inline-profile-form__field">
          <label htmlFor="surname">Фамилия</label>
          <Input
            id="surname"
            value={form.surname}
            placeholder="Фамилия"
            onChange={(value) => handleChange('surname', value)}
          />
          {errors.surname ? <span className="input-error-text">{errors.surname}</span> : null}
        </div>

        <div className="inline-profile-form__field">
          <label htmlFor="name">Имя</label>
          <Input
            id="name"
            value={form.name}
            placeholder="Имя"
            onChange={(value) => handleChange('name', value)}
          />
          {errors.name ? <span className="input-error-text">{errors.name}</span> : null}
        </div>

        <div className="inline-profile-form__field">
          <label htmlFor="patronymic">Отчество</label>
          <Input
            id="patronymic"
            value={form.patronymic}
            placeholder="Отчество"
            onChange={(value) => handleChange('patronymic', value)}
          />
          {errors.patronymic ? <span className="input-error-text">{errors.patronymic}</span> : null}
        </div>

        <div className="inline-profile-form__field">
          <label htmlFor="pseudonym">Псевдоним</label>
          <Input
            id="pseudonym"
            value={form.pseudonym}
            placeholder="Псевдоним"
            onChange={(value) => handleChange('pseudonym', value)}
          />
          {errors.pseudonym ? <span className="input-error-text">{errors.pseudonym}</span> : null}
        </div>

        <div className="inline-profile-form__field">
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

        <div className="inline-profile-form__field">
          <label htmlFor="phone">Телефон</label>
          <Input
            id="phone"
            value={formatPhone(form.phone)}
            placeholder="+7 (___) ___-__-__"
            onChange={handlePhoneChange}
          />
          {errors.phone ? <span className="input-error-text">{errors.phone}</span> : null}
        </div>

        <div className="inline-profile-form__field">
          <label htmlFor="experience">Опыт (лет)</label>
          <InputNumber
            id="experience"
            value={form.experience}
            onChange={(value) => handleChange('experience', Number(value) || 0)}
            min={0}
            className="inline-profile-form__number-input"
          />
        </div>

        <div className="inline-profile-form__field">
          <label htmlFor="description">Краткая информация</label>
          <Input
            id="description"
            value={form.description}
            placeholder="Опишите специализацию"
            onChange={(value) => handleChange('description', value)}
          />
        </div>

        <div className="inline-profile-form__field">
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

        <div className="inline-profile-form__field inline-profile-form__time">
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

        <div className="inline-profile-form__field">
          <label htmlFor="daysOfWeek">Дни работы</label>
          <TagPicker
            id="daysOfWeek"
            data={dayOptions}
            value={form.daysOfWeek}
            onChange={(value) => handleChange('daysOfWeek', value ?? [])}
            placeholder="Выберите дни"
            block
          />
          {errors.daysOfWeek ? <span className="input-error-text">{errors.daysOfWeek}</span> : null}
        </div>

        <div className="inline-profile-form__field">
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

      <div className="inline-profile-form__actions">
        <Button
          appearance="primary"
          className="orange-btn"
          onClick={handleSubmit}
          loading={loading}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};
