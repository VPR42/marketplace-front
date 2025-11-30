/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
/* eslint-enable import/no-duplicates */

import { CustomLoader } from '@/components/CustomLoader/ui';
import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppSelector } from '@/redux-rtk/hooks';
import {
  selectFilteredFavorites,
  selectFavoritesStatus,
  selectAllFavorites,
} from '@/redux-rtk/store/favorites/selectors';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import './FavoritesPage.scss';

export const FavoritesList: React.FC<FavoritesListProps> = ({ loadingState, onToggle }) => {
  const allFavorites = useAppSelector(selectAllFavorites);
  const filtered = useAppSelector(selectFilteredFavorites);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);
  const status = loadingState ?? favoritesStatus;
  const [togglingIds, setTogglingIds] = useState(new Set());

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

  if (status === 'loading') {
    return (
      <div className="FavoritesPage__list--load">
        <CustomLoader size="md" />
      </div>
    );
  }

  if (hasFavorites && !hasFiltered) {
    return (
      <div className="FavoritesPage__empty">
        <div className="FavoritesPage__empty-title">Ничего не найдено</div>
        <div className="FavoritesPage__empty-sub">Попробуйте изменить параметры фильтра</div>
      </div>
    );
  }

  if (!hasFavorites) {
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
          workerName={it.user?.master?.pseudonym}
          timeAgo={formatDistanceToNow(parseISO(it.createdAt), {
            addSuffix: true,
            locale: ru,
          })}
          description={it.description}
          price={it.price}
          image={it.coverUrl ?? undefined}
          category={it.category?.name}
          location={it.user?.city?.name ?? undefined}
          tags={it.tags?.map((t) => t.name)}
          onProfile={handleProfile}
          onMessage={handleMessage}
          onToggle={handleToggle}
          isFavorite={true}
          isToggling={togglingIds.has(it.id)}
        />
      ))}
    </div>
  );
};
