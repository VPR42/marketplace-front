import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { InlineProfileForm } from '@/components/EditUserProfile';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { createProfileMasterInfo, fetchOwnProfile } from '@/redux-rtk/store/profile/profileThunks';
import { fetchSkills } from '@/redux-rtk/store/utils/utilsThunks';

import './welcome.scss';

export const WelcomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuthState);
  const { data: profile, status } = useAppSelector((state) => state.profile);
  const { skills } = useAppSelector((state) => state.utils);

  useEffect(() => {
    dispatch(fetchSkills());
    dispatch(fetchOwnProfile());
  }, [dispatch]);

  const initialValues = useMemo(
    () => ({
      name: profile?.name || user?.name || '',
      surname: profile?.surname || user?.surname || '',
      patronymic: profile?.patronymic || user?.patronymic || '',
      city: profile?.city || user?.city || null,
      avatarUrl: profile?.avatarPath,
    }),
    [profile, user],
  );

  const handleSubmit = async (values: {
    experience: number;
    description: string;
    pseudonym: string;
    phone: string;
    about: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    skills: number[];
  }) => {
    try {
      await dispatch(
        createProfileMasterInfo({
          masterInfo: {
            experience: values.experience,
            description: values.description,
            pseudonym: values.pseudonym,
            phoneNumber: values.phone,
            about: values.about,
            daysOfWeek: values.daysOfWeek,
            startTime: values.startTime,
            endTime: values.endTime,
          },
          skills: values.skills,
        }),
      ).unwrap();
      navigate('/profile');
    } catch (error) {
      // оставить на месте, пусть юзер поправит
    }
  };

  return (
    <div className="WelcomePage">
      <div className="WelcomePage__card">
        <h1 className="WelcomePage__title">Добро пожаловать в JobHub!</h1>
        <p className="WelcomePage__subtitle">
          Спасибо за регистрацию. Расскажите о себе, чтобы начать создавать услуги и принимать
          заказы.
        </p>
        <InlineProfileForm
          initialValues={initialValues}
          skillsOptions={skills}
          onSubmit={handleSubmit}
          loading={status === 'loading'}
        />
      </div>
    </div>
  );
};
