import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { EditUserProfileForm } from '@/components/EditUserProfile';
import { EditUserProfileModal } from '@/components/EditUserProfile';
import { useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { myServices } from '@/shared/data/myServices';
import { services } from '@/shared/data/services';

import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';
import { ProfileHeader } from './ProfileHeader';
import { RecentOrdersSection } from './RecentOrdersSection';
import { ServicesSection } from './ServicesSection';
import { SkillsSection } from './SkillsSection';

import './profile.scss';

type BasicService = {
  id: string | number;

  title: string;

  description: string;

  price: string | number;

  orders?: number;

  gradient?: string;

  workerName?: string;

  workerRating?: string;

  workerAvatar?: string;
};

export const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();

  const { user: currentUser, isAuthenticated } = useAppSelector(selectAuthState);

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const profileUserId = userId || currentUser?.id;

  const isOwner = currentUser?.id === profileUserId;

  const rawServices: BasicService[] = useMemo(
    () => (isOwner ? myServices : services.filter((s) => s.workerName)),

    [isOwner],
  );

  const isMaster = rawServices.length > 0;

  const userServices = rawServices.map((service) => ({
    id: String(service.id),

    title: service.title,

    description: service.description,

    price: typeof service.price === 'number' ? service.price : parseInt(service.price) || 0,

    orders: service.orders ? Number(service.orders) : 0,

    gradient: service.gradient || 'linear-gradient(135deg, #6e45e2, #88d3ce)',

    workerName: service.workerName,

    workerRating: service.workerRating,

    workerAvatar: service.workerAvatar,
  }));

  const canEdit = isOwner && isAuthenticated;

  const previewEditMode = !isAuthenticated;

  const canShowEditButton = canEdit || previewEditMode;

  const profileAbout = isMaster
    ? 'Специалист работаю с техникой и мебелью более 8 лет. Провожу настройку, ремонт, сборку мебели, электромонтажные работы и мелкий бытовой ремонт. Работал на крупных производственных объектах, умею работать по ГОСТ и выполнять работу в срок. Сотрудничаю с частными заказчиками и организациями.'
    : undefined;

  const profileSkills = isMaster
    ? ['Сборка мебели', 'Ремонт бытовой техники', 'Электромонтаж', 'Мелкий ремонт']
    : undefined;

  const profileOrders = isMaster
    ? [
        {
          id: 1,

          title: 'Монтаж проводки',

          price: 6500,

          date: '18.01.2025',

          status: 'cancelled' as const,
        },

        {
          id: 2,

          title: 'Сборка мебели',

          price: 4500,

          date: '12.01.2025',

          status: 'cancelled' as const,
        },

        {
          id: 3,

          title: 'Установка техники',

          price: 2300,

          date: '10.01.2025',

          status: 'completed' as const,
        },

        {
          id: 4,

          title: 'Установка розеток',

          price: 1200,

          date: '05.01.2025',

          status: 'completed' as const,
        },
      ]
    : undefined;

  const ordersCount = isMaster ? 127 : 0;

  const successRate = isMaster ? 98 : undefined;

  const handleEditProfile = () => setEditModalOpen(true);

  const handleEditAbout = () => {};

  const handleEditSkills = () => {};

  const handleAddService = () => {};

  const handleServiceClick = (_serviceId: string) => {};

  const handleEditContact = () => {};

  const handleShare = () => {};

  const handleMessage = () => {};

  const editInitialValues = {
    name: currentUser?.name ?? '',

    surname: currentUser?.surname ?? '',

    patronymic: currentUser?.patronymic ?? '',

    nickname: currentUser ? `${currentUser.name} ${currentUser.surname}` : '',

    phone: currentUser ? '+7 (999) 123-45-67' : '',

    city: currentUser?.city ?? null,

    about: profileAbout ?? '',

    workingHours: isMaster ? 'Пн-Пт 09:00-20:00' : '',

    skills: profileSkills ?? [],

    avatarUrl: currentUser?.avatarPath,
  };

  const handleProfileSubmit = (values: EditUserProfileForm) => {
    console.log('Сохранить профиль', values);
  };

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        <div className="ProfilePage__main">
          <ProfileHeader
            user={currentUser}
            ordersCount={ordersCount}
            successRate={successRate}
            canEdit={canShowEditButton}
            onEdit={handleEditProfile}
            onShare={handleShare}
          />

          <AboutSection text={profileAbout} canEdit={canEdit} onEdit={handleEditAbout} />

          {isMaster && (
            <SkillsSection skills={profileSkills} canEdit={canEdit} onEdit={handleEditSkills} />
          )}

          {isMaster && (
            <ServicesSection
              services={userServices}
              canEdit={canEdit}
              onAddService={handleAddService}
              onServiceClick={handleServiceClick}
            />
          )}
        </div>

        <div className="ProfilePage__sidebar">
          <ContactSection
            phone={currentUser ? '+7 (999) 123-45-67' : undefined}
            email={currentUser?.email}
            cityId={currentUser?.city}
            workingHours={isMaster ? 'Пн-Пт: 9:00-20:00' : undefined}
            canEdit={canEdit}
            onEdit={handleEditContact}
            onMessage={!canEdit ? handleMessage : undefined}
          />

          {isMaster && <RecentOrdersSection orders={profileOrders} />}
        </div>
      </div>

      {(isOwner || previewEditMode) && (
        <EditUserProfileModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialValues={editInitialValues}
          onSubmit={handleProfileSubmit}
        />
      )}
    </div>
  );
};
