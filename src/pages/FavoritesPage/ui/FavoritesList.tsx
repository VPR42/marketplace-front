/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useCallback, useMemo, useState, type JSX } from 'react';
/* eslint-enable import/no-duplicates */

import { useNavigate } from 'react-router-dom';

import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { createChat } from '@/redux-rtk/store/chats/chatsThunks';
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from '@/redux-rtk/store/favorites/favoriteThunks';
import {
  selectAllFavorites,
  selectFavoritesStatus,
  selectFilteredFavorites,
} from '@/redux-rtk/store/favorites/selectors';
import type { FavoriteJob } from '@/redux-rtk/store/favorites/types';
import type { UserExtended } from '@/redux-rtk/store/profile/types';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import './FavoritesPage.scss';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';
import { createOrder } from '@/redux-rtk/store/orders/ordersThunks';

export const FavoritesList: React.FC<FavoritesListProps> = ({ onToggle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const allFavorites = useAppSelector(selectAllFavorites);
  const filtered = useAppSelector(selectFilteredFavorites);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<FavoriteJob | null>(null);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const [creatingOrderId, setCreatingOrderId] = useState<string | null>(null);

  const handleProfile = useCallback(
    (id?: string | null) => {
      if (!id) {
        return;
      }
      navigate(`/profile/${id}`);
    },
    [navigate],
  );

  const handleMessage = useCallback(
    async (serviceId: string) => {
      try {
        await dispatch(createChat({ serviceId })).unwrap();
        navigate(`/chats`);
      } catch (err) {
        console.error('Ошибка создания чата', err);
      }
    },
    [dispatch, navigate],
  );

  const handleToggle = useCallback(
    async (id: string, makeFav: boolean) => {
      setTogglingIds((prev) => {
        const clone = new Set(prev);
        clone.add(id);
        return clone;
      });
      try {
        await onToggle?.(id, makeFav);
      } finally {
        setTogglingIds((prev) => {
          const clone = new Set(prev);
          clone.delete(id);
          return clone;
        });
      }
    },
    [onToggle],
  );

  const handleOpenDetail = useCallback(
    (service: FavoriteJob) => {
      const actual =
        filtered.find((s) => s.id === service.id) ??
        allFavorites.find((s) => s.id === service.id) ??
        service;
      setSelectedService(actual);
      setOpenDetailModal(true);
    },
    [filtered, allFavorites],
  );

  const handleCloseDetail = useCallback(() => {
    setOpenDetailModal(false);
    setSelectedService(null);
  }, []);

  const handleFavorite = useCallback(async () => {
    if (!selectedService) {
      return;
    }
    if (togglingFavoriteId === selectedService.id) {
      return;
    }

    setTogglingFavoriteId(selectedService.id);
    const alreadyFav =
      filtered.some((f) => f.id === selectedService.id) ||
      allFavorites?.some((f) => f.id === selectedService.id);

    try {
      if (alreadyFav) {
        await dispatch(removeFromFavorites(selectedService.id)).unwrap();
      } else {
        await dispatch(addToFavorites(selectedService.id)).unwrap();
      }
      await dispatch(fetchFavorites()).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setTogglingFavoriteId(null);
    }
  }, [selectedService, togglingFavoriteId, filtered, allFavorites, dispatch]);

  const isSelectedFavorite = useMemo(() => {
    if (!selectedService) {
      return false;
    }
    return (
      filtered.some((f) => f.id === selectedService.id) ||
      allFavorites?.some((f) => f.id === selectedService.id)
    );
  }, [selectedService, filtered, allFavorites]);

  const serviceProp = useMemo(() => {
    if (!selectedService) {
      return undefined;
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

    return {
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
    } as const;
  }, [selectedService]);

  const handleOrder = useCallback(async (): Promise<void> => {
    if (!selectedService) {
      return Promise.reject(new Error('No service selected'));
    }
    setCreatingOrderId(selectedService.id);

    try {
      const result = await dispatch(createOrder({ jobId: selectedService.id })).unwrap();

      const orderId = result.id;
      if (orderId) {
        navigate(`/my-orders?orderId=${orderId}`);
      }

      return Promise.resolve();
    } catch (err) {
      console.error('Order failed', err);
      return Promise.reject(err);
    } finally {
      setCreatingOrderId(null);
    }
  }, [selectedService, dispatch, navigate]);

  const hasFavorites = (allFavorites?.length ?? 0) > 0;
  const hasFiltered = (filtered?.length ?? 0) > 0;
  const loading = favoritesStatus === 'loading';

  let content: JSX.Element;
  if (hasFavorites && !hasFiltered && !loading) {
    content = (
      <div className="FavoritesPage__empty">
        <div className="FavoritesPage__empty-title">Ничего не найдено</div>
        <div className="FavoritesPage__empty-sub">Попробуйте изменить параметры фильтра</div>
      </div>
    );
  } else if (!hasFavorites && !loading) {
    content = (
      <div className="FavoritesPage__empty">
        <div className="FavoritesPage__empty-title">Избранное пусто</div>
        <div className="FavoritesPage__empty-sub">
          Сохраните понравившиеся услуги, чтобы увидеть их здесь.
        </div>
      </div>
    );
  } else {
    content = (
      <>
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
            onProfile={() => handleProfile(it.user?.id ?? null)}
            onMessage={() => handleMessage(it.id)}
            onToggle={handleToggle}
            isFavorite={true}
            isToggling={togglingIds.has(it.id)}
            onClick={() => handleOpenDetail(it)}
          />
        ))}
      </>
    );
  }

  return (
    <div className="FavoritesPage__list">
      {content}

      {openDetailModal && selectedService && serviceProp && (
        <ServiceDetailModal
          open={openDetailModal}
          onClose={handleCloseDetail}
          service={serviceProp}
          disableActions={false}
          isCreatingOrder={creatingOrderId === selectedService.id}
          onOrder={handleOrder}
          isFavorite={isSelectedFavorite}
          isTogglingFavorite={togglingFavoriteId === selectedService.id}
          onFavorite={handleFavorite}
          onGoToOrders={() => navigate('/my-orders')}
        />
      )}
    </div>
  );
};
