/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

/* eslint-enable import/no-duplicates */
import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from '@/redux-rtk/store/favorites/favoriteThunks';
import {
  selectFilteredFavorites,
  selectFavoritesStatus,
  selectAllFavorites,
} from '@/redux-rtk/store/favorites/selectors';
import type { FavoriteJob } from '@/redux-rtk/store/favorites/types';
import type { UserExtended } from '@/redux-rtk/store/profile/types';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import './FavoritesPage.scss';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';

export const FavoritesList: React.FC<FavoritesListProps> = ({ onToggle }) => {
  const dispatch = useAppDispatch();
  const allFavorites = useAppSelector(selectAllFavorites);
  const filtered = useAppSelector(selectFilteredFavorites);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<FavoriteJob>();
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);

  const handleProfile = (id: string) => {
    console.warn('профиль', id);
  };

  const handleMessage = (id: string) => {
    console.warn('написать', id);
  };

  const handleToggle = async (id: string, makeFav: boolean) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    try {
      await onToggle?.(id, makeFav);
    } finally {
      setTogglingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleOpenDetail = (service: FavoriteJob) => {
    const actual =
      filtered.find((s) => s.id === service.id) ??
      allFavorites.find((s) => s.id === service.id) ??
      service;

    setSelectedService(actual);
    setOpenDetailModal(true);
  };

  const handleFavorite = async () => {
    if (!selectedService) {
      return;
    }
    if (togglingFavoriteId === selectedService.id) {
      return;
    }

    setTogglingFavoriteId(selectedService.id);
    const alreadyFav = filtered.some((f) => f.id === selectedService.id);

    try {
      if (alreadyFav) {
        await dispatch(removeFromFavorites(selectedService.id)).unwrap();
      } else {
        await dispatch(addToFavorites(selectedService.id)).unwrap();
      }
      await dispatch(fetchFavorites()).unwrap();
    } catch (error) {
      void error;
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  const hasFavorites = (allFavorites?.length ?? 0) > 0;
  const hasFiltered = (filtered?.length ?? 0) > 0;

  const loading = favoritesStatus === 'loading';

  if (hasFavorites && !hasFiltered && !loading) {
    return (
      <div className="FavoritesPage__empty">
        <div className="FavoritesPage__empty-title">Ничего не найдено</div>
        <div className="FavoritesPage__empty-sub">Попробуйте изменить параметры фильтра</div>
      </div>
    );
  }

  if (!hasFavorites && !loading) {
    return (
      <div className="FavoritesPage__empty">
        <div className="FavoritesPage__empty-title">Избранное пусто</div>
        <div className="FavoritesPage__empty-sub">
          Сохраните понравившиеся услуги, чтобы увидеть их здесь.
        </div>
      </div>
    );
  }

  const normalizeUser = (u: FavoriteJob['user']): UserExtended =>
    ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      patronymic: u.patronymic ?? '',
      email: u.email ?? '',
      avatarPath: u.avatarPath ?? '',
      city: u.city ?? null,
      master: u.master ?? null,
    }) as UserExtended;

  return (
    <div className="FavoritesPage__list">
      {filtered.map((it) => (
        <MyServiceCard
          mode="favorite"
          key={it.id}
          id={it.id}
          title={it.name}
          gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
          workerName={it.user?.master?.pseudonym}
          workerAvatar={it.user?.avatarPath ?? ''}
          timeAgo={formatDistanceToNow(parseISO(it.createdAt), {
            addSuffix: true,
            locale: ru,
          })}
          description={it.description}
          price={it.price}
          cover={it.coverUrl ?? undefined}
          category={it.category?.name}
          location={it.user?.city?.name ?? undefined}
          tags={it.tags?.map((t) => t.name)}
          onProfile={handleProfile}
          onMessage={handleMessage}
          onToggle={handleToggle}
          isFavorite={true}
          isToggling={togglingIds.has(it.id)}
          onClick={() => handleOpenDetail(it)}
        />
      ))}
      {openDetailModal && selectedService && (
        <ServiceDetailModal
          open={openDetailModal}
          onClose={() => {
            setOpenDetailModal(false);
            setSelectedService(undefined);
          }}
          service={{
            id: selectedService.id,
            title: selectedService.name,
            description: selectedService.description,
            price: selectedService.price,
            orders: selectedService.ordersCount,
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            coverUrl: selectedService.coverUrl ?? undefined,
            workerName:
              selectedService.user.master?.pseudonym ||
              `${selectedService.user.name} ${selectedService.user.surname}`,
            workerAvatar: selectedService.user.avatarPath ?? '',
            workerRating: '-',
            category: selectedService.category?.name ?? undefined,
            tags: selectedService.tags?.map((t) => t.name) ?? [],
            experience: selectedService.user.master?.experience
              ? `${selectedService.user.master.experience} лет опыта`
              : undefined,
            location: selectedService.user.city?.name ?? undefined,
            user: normalizeUser(selectedService.user),
          }}
          disableActions={false}
          isCreatingOrder={false}
          onOrder={async () => Promise.reject(new Error('...'))}
          isFavorite={true}
          isTogglingFavorite={togglingFavoriteId === selectedService.id}
          onFavorite={handleFavorite}
          onGoToOrders={() => {}}
        />
      )}
    </div>
  );
};
//
