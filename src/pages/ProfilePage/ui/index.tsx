import { useParams } from 'react-router-dom';

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

export const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, isAuthenticated } = useAppSelector(selectAuthState);

  // Определяем, чей профиль смотрим
  const profileUserId = userId || currentUser?.id;
  const isOwner = currentUser?.id === profileUserId;

  // Определяем, является ли пользователь мастером (по наличию услуг)
  // Для своего профиля проверяем myServices, для чужого - services
  const rawServices = isOwner ? myServices : services.filter((s) => s.workerName);
  const isMaster = rawServices.length > 0;

  const userServices = rawServices.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: typeof service.price === 'number' ? service.price : parseInt(service.price) || 0,
    orders: 'orders' in service ? service.orders : 0,
    gradient:
      'gradient' in service ? service.gradient : 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    workerName: 'workerName' in service ? service.workerName : undefined,
    workerRating: 'workerRating' in service ? service.workerRating : undefined,
    workerAvatar: 'workerAvatar' in service ? service.workerAvatar : undefined,
  }));

  // Флаг редактирования
  const canEdit = isOwner && isAuthenticated;

  // Моковые данные профиля (в реальном приложении будут загружаться с API)
  const profileAbout = isMaster
    ? 'Профессиональный мастер по ремонту бытовой техники с опытом работы более 8 лет. Специализируюсь на ремонте стиральных машин, холодильников, посудомоечных машин и другой крупной бытовой техники. Работаю только с оригинальными запчастями, предоставляю гарантию на все виды работ. Выезжаю на дом в любое удобное для клиента время.'
    : undefined;

  const profileSkills = isMaster
    ? [
        'Ремонт стиральных машин',
        'Ремонт холодильников',
        'Ремонт посудомоечных машин',
        'Диагностика техники',
        'Замена запчастей',
        'Профилактическое обслуживание',
      ]
    : undefined;

  const profileOrders = isMaster
    ? [
        {
          id: 1,
          title: 'Ремонт стиральной машины',
          price: 6500,
          date: '18.01.2025',
          status: 'cancelled' as const,
        },
        {
          id: 2,
          title: 'Ремонт стиральной машины',
          price: 6500,
          date: '18.01.2025',
          status: 'cancelled' as const,
        },
        {
          id: 3,
          title: 'Чистка стиральной машины',
          price: 2300,
          date: '10.01.2025',
          status: 'completed' as const,
        },
        {
          id: 4,
          title: 'Диагностика посудомойки',
          price: 1200,
          date: '05.01.2025',
          status: 'completed' as const,
        },
      ]
    : undefined;

  const ordersCount = isMaster ? 127 : 0;
  const successRate = isMaster ? 98 : undefined;

  const handleEditProfile = () => {
    console.log('Редактирование профиля');
  };

  const handleEditAbout = () => {
    console.log('Редактирование "Обо мне"');
  };

  const handleEditSkills = () => {
    console.log('Редактирование навыков');
  };

  const handleAddService = () => {
    console.log('Добавление услуги');
  };

  const handleServiceClick = (serviceId: number) => {
    console.log('Клик по услуге:', serviceId);
  };

  const handleEditContact = () => {
    console.log('Редактирование контактов');
  };

  const handleShare = () => {
    console.log('Поделиться профилем');
    if (navigator.share) {
      navigator.share({
        title: `Профиль ${currentUser?.name}`,
        url: window.location.href,
      });
    }
  };

  const handleMessage = () => {
    console.log('Написать сообщение');
  };

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        <div className="ProfilePage__main">
          <ProfileHeader
            user={currentUser}
            ordersCount={ordersCount}
            successRate={successRate}
            canEdit={canEdit}
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
    </div>
  );
};
