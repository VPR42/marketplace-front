import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'rsuite';

import type { EditUserProfileForm } from '@/components/EditUserProfile';
import { EditUserProfileModal } from '@/components/EditUserProfile';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import {
  createProfileMasterInfo,
  fetchOwnProfile,
  fetchProfileById,
  updateProfileMasterInfo,
  updateProfileSkills,
  updateProfileUser,
} from '@/redux-rtk/store/profile/profileThunks';
import { fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import type { Service } from '@/redux-rtk/store/services/types';
import type { Skill } from '@/redux-rtk/store/utils/types';
import { ServiceCreationModal } from '@/shared/ServiceCreationModal/ui';
import { getWeekDayShort } from '@/shared/utils/weekDays';

import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';
import { ProfileHeader } from './ProfileHeader';
import { RecentOrdersSection } from './RecentOrdersSection';
import { ServicesSection } from './ServicesSection';
import { SkillsSection } from './SkillsSection';

import './profile.scss';

interface BasicService {
  id: string;
  title: string;
  description: string;
  price: number;
  orders?: number;
  gradient?: string;
  workerName?: string;
  workerRating?: string;
  workerAvatar?: string;
}

const mapServicesToCards = (services: Service[]): BasicService[] =>
  services.map((service) => ({
    id: service.id,
    title: service.name,
    description: service.description,
    price: service.price,
    orders: service.ordersCount,
    workerName: `${service.user.surname} ${service.user.name}`,
    workerAvatar: service.user.avatarPath,
    gradient: service.coverUrl,
  }));

export const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const dispatch = useAppDispatch();

  const { user: currentUser, isAuthenticated } = useAppSelector(selectAuthState);
  const {
    data: profile,
    isOwner,
    status: profileStatus,
  } = useAppSelector((state) => state.profile);
  const servicesState = useAppSelector((state) => state.services);
  const utilsState = useAppSelector((state) => state.utils);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [hasShownOnboarding, setHasShownOnboarding] = useState(
    Boolean(sessionStorage.getItem('profileOnboardingShown')),
  );
  const [shareCopied, setShareCopied] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfileById(userId));
    } else {
      dispatch(fetchOwnProfile());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile?.id) {
      dispatch(
        fetchServices({
          masterId: profile.id,
          pageSize: 6,
        }),
      );
    }
  }, [dispatch, profile?.id]);

  useEffect(() => {
    if (
      profile &&
      isOwner &&
      !hasShownOnboarding &&
      (!profile.masterInfo?.description || profile.skills.length === 0)
    ) {
      setEditModalOpen(true);
      setHasShownOnboarding(true);
      sessionStorage.setItem('profileOnboardingShown', 'true');
    }
  }, [hasShownOnboarding, isOwner, profile]);

  const skillsMap = useMemo(
    () =>
      utilsState.skills.reduce<Record<number, Skill>>((acc, skill) => {
        acc[skill.id] = skill;
        return acc;
      }, {}),
    [utilsState.skills],
  );

  const profileSkills = useMemo(
    () => profile?.skills.map((id) => skillsMap[id]?.name ?? `Навык #${id}`),
    [profile?.skills, skillsMap],
  );

  const isMaster = Boolean(profile?.masterInfo);

  const userServices: BasicService[] = mapServicesToCards(servicesState.items || []);

  const canEdit = isOwner && isAuthenticated;
  const canShowEditButton = canEdit;

  const profileAbout = profile?.masterInfo?.about;
  const ordersCount = profile?.orders?.ordersCount ?? 0;
  const successRate = profile?.orders?.completedPercent;

  const handleEditProfile = () => setEditModalOpen(true);
  const handleEditAbout = () => setEditModalOpen(true);
  const handleEditSkills = () => setEditModalOpen(true);
  const handleServiceClick = (_serviceId: string) => {};
  const handleOpenServiceModal = () => setOpenServiceModal(true);
  const handleEditContact = () => setEditModalOpen(true);
  const handleShare = async () => {
    try {
      const base = window.location.origin;
      const targetId = userId || profile?.id || currentUser?.id;
      const link = targetId ? `${base}/profile/${targetId}` : window.location.href;
      await navigator.clipboard.writeText(link);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (error) {
      setShareCopied(false);
    }
  };
  const handleMessage = () => {};

  const editInitialValues: EditUserProfileForm = {
    name: profile?.name ?? '',
    surname: profile?.surname ?? '',
    patronymic: profile?.patronymic ?? '',
    pseudonym: profile?.masterInfo?.pseudonym ?? '',
    phone: profile?.masterInfo?.phoneNumber ?? '',
    city: profile?.city ?? null,
    about: profile?.masterInfo?.about ?? '',
    description: profile?.masterInfo?.description ?? '',
    experience: profile?.masterInfo?.experience ?? 0,
    daysOfWeek: profile?.masterInfo?.daysOfWeek ?? [],
    startTime: profile?.masterInfo?.startTime ?? '',
    endTime: profile?.masterInfo?.endTime ?? '',
    skills: profile?.skills ?? [],
    avatarUrl: profile?.avatarPath,
  };

  const handleProfileSubmit = async (values: EditUserProfileForm) => {
    if (!profile) {
      return;
    }

    const isFirstFill = !profile.masterInfo?.description && profile.skills.length === 0;

    if (isFirstFill) {
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
      );
      return;
    }

    if (
      values.name !== profile.name ||
      values.surname !== profile.surname ||
      values.patronymic !== profile.patronymic ||
      values.city !== profile.city
    ) {
      await dispatch(
        updateProfileUser({
          name: values.name,
          surname: values.surname,
          patronymic: values.patronymic,
          city: values.city ?? undefined,
        }),
      );
    }

    if (
      values.experience !== profile.masterInfo.experience ||
      values.description !== profile.masterInfo.description ||
      values.pseudonym !== profile.masterInfo.pseudonym ||
      values.phone !== profile.masterInfo.phoneNumber ||
      values.about !== profile.masterInfo.about ||
      values.startTime !== profile.masterInfo.startTime ||
      values.endTime !== profile.masterInfo.endTime ||
      values.daysOfWeek.join(',') !== profile.masterInfo.daysOfWeek.join(',')
    ) {
      await dispatch(
        updateProfileMasterInfo({
          experience: values.experience,
          description: values.description,
          pseudonym: values.pseudonym,
          phoneNumber: values.phone,
          about: values.about,
          daysOfWeek: values.daysOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
        }),
      );
    }

    if (values.skills.join(',') !== profile.skills.join(',')) {
      await dispatch(updateProfileSkills(values.skills));
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    if (
      isOwner &&
      !hasShownOnboarding &&
      (!profile?.masterInfo?.description || (profile?.skills?.length ?? 0) === 0)
    ) {
      setHasShownOnboarding(true);
      sessionStorage.setItem('profileOnboardingShown', 'true');
    }
  };

  if (profileStatus === 'loading' && !profile) {
    return (
      <div className="ProfilePage ProfilePage__loader">
        <Loader center content="Загрузка профиля..." />
      </div>
    );
  }

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        <div className="ProfilePage__main">
          <ProfileHeader
            user={profile ?? null}
            ordersCount={ordersCount}
            successRate={successRate}
            canEdit={canShowEditButton}
            onEdit={handleEditProfile}
            onShare={handleShare}
          />
          {shareCopied && (
            <div className="ProfilePage__share-toast">Ссылка скопирована в буфер обмена!</div>
          )}

          <AboutSection text={profileAbout} canEdit={canEdit} onEdit={handleEditAbout} />

          {isMaster && (
            <SkillsSection skills={profileSkills} canEdit={canEdit} onEdit={handleEditSkills} />
          )}

          <ServicesSection
            services={userServices}
            canEdit={canEdit}
            onAddService={handleOpenServiceModal}
            onServiceClick={handleServiceClick}
          />
        </div>

        <div className="ProfilePage__sidebar">
          <ContactSection
            phone={profile?.masterInfo?.phoneNumber}
            email={profile?.email}
            cityId={profile?.city}
            workingHours={
              isMaster &&
              profile?.masterInfo?.startTime &&
              profile?.masterInfo?.endTime &&
              profile.masterInfo?.daysOfWeek
                ? `${profile.masterInfo.daysOfWeek
                    .map((el) => getWeekDayShort(el))
                    .join(', ')}, ${profile.masterInfo.startTime} - ${profile.masterInfo.endTime}`
                : undefined
            }
            canEdit={canEdit}
            onEdit={handleEditContact}
            onMessage={!canEdit ? handleMessage : undefined}
          />

          <RecentOrdersSection />
        </div>
      </div>

      {canShowEditButton && (
        <EditUserProfileModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          initialValues={editInitialValues}
          skillsOptions={utilsState.skills}
          showHint={
            !hasShownOnboarding &&
            isOwner &&
            (!profile?.masterInfo?.description || (profile?.skills?.length ?? 0) === 0)
          }
          onSubmit={handleProfileSubmit}
        />
      )}
      {openServiceModal && (
        <ServiceCreationModal
          open={openServiceModal}
          onClose={() => setOpenServiceModal(false)}
          mode="create"
          onSubmit={() => setOpenServiceModal(false)}
        />
      )}
    </div>
  );
};
