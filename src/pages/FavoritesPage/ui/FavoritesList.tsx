/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
/* eslint-enable import/no-duplicates */

import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import {
  selectFilteredFavorites,
  selectFavoritesStatus,
  selectAllFavorites,
} from '@/redux-rtk/store/favorites/selectors';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import './FavoritesPage.scss';
import { useNavigate } from 'react-router-dom';

import { createChat } from '@/redux-rtk/store/chats/chatsThunks';

export const FavoritesList: React.FC<FavoritesListProps> = ({ onToggle }) => {
  const dispatch = useAppDispatch();

  const allFavorites = useAppSelector(selectAllFavorites);
  const filtered = useAppSelector(selectFilteredFavorites);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const navigate = useNavigate();

  const handleProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleMessage = async (serviceId: string) => {
    try {
      await dispatch(createChat({ serviceId })).unwrap();
      navigate(`/chats`);
    } catch (err) {
      console.error('Ошибка создания чата', err);
    }
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
          onProfile={() => handleProfile(it.user?.id)}
          onMessage={() => handleMessage(it.id)}
          onToggle={handleToggle}
          isFavorite={true}
          isToggling={togglingIds.has(it.id)}
        />
      ))}
    </div>
  );
};
