/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
/* eslint-enable import/no-duplicates */

import { useNavigate } from 'react-router-dom';

import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppSelector } from '@/redux-rtk/hooks';
import {
  selectAllFavorites,
  selectFavoritesStatus,
  selectFilteredFavorites,
} from '@/redux-rtk/store/favorites/selectors';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import './FavoritesPage.scss';

export const FavoritesList: React.FC<FavoritesListProps> = ({ onToggle }) => {
  const allFavorites = useAppSelector(selectAllFavorites);
  const filtered = useAppSelector(selectFilteredFavorites);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);
  const [togglingIds, setTogglingIds] = useState(new Set());

  const navigate = useNavigate();

  const handleGoToMasterProfile = (id: string) => {
    const profile = filtered.find((job) => job.id === id)?.user.id;
    navigate(`/profile/${profile}`);
  };

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
          onProfile={() => handleGoToMasterProfile(it.id)}
          onToggle={handleToggle}
          isFavorite={true}
          isToggling={togglingIds.has(it.id)}
        />
      ))}
    </div>
  );
};
