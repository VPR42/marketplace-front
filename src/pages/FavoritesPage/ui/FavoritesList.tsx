import { MyServiceCard } from '@/shared/MyServicesCard/ui';

import { formatDistanceToNow, parseISO, ru } from 'date-fns';

import './FavoritesPage.scss';
import { useEffect } from 'react';

import { CustomLoader } from '@/components/CustomLoader/ui';
import type { FavoritesListProps } from '@/pages/FavoritesPage/types';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from '@/redux-rtk/store/favorites/favoriteThunks';
import { selectFavorites, selectFavoritesStatus } from '@/redux-rtk/store/favorites/selectors';

export const FavoritesList: React.FC<FavoritesListProps> = ({ filterCategory = 'Все' }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const status = useAppSelector(selectFavoritesStatus);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const filteredFavorites = favorites.filter((it) => {
    if (filterCategory === 'Все') {
      return true;
    }
    return it.category?.name === filterCategory;
  });

  const handleToggle = async (id: string, makeFavorite: boolean) => {
    try {
      if (makeFavorite) {
        await dispatch(addToFavorites(id)).unwrap();
        // await dispatch(fetchFavorites()); // крч тут прикол что если делать рефетч и ты убрал допустим 2 случайно то если одну из них обратно добавить то у тя вторая пропадет ибо на беке она уже не в избранном да
      } else {
        await dispatch(removeFromFavorites(id)).unwrap();
      }
    } catch (err) {
      console.error('Не удалось обновить избранное:', err);
      throw err;
    }
  };

  const handleProfile = (id: string) => {
    console.log('профиль', id);
  };

  const handleMessage = (id: string) => {
    console.log('написать', id);
  };

  if (status === 'loading') {
    return (
      <div className="FavoritesPage__list--load">
        <CustomLoader size="md" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return <div className="FavoritesPage__list--empty">В избранном пока пусто.</div>;
  }

  if (filteredFavorites.length === 0) {
    return <div className="FavoritesPage__list--empty">Нет избранных услуг в этой категории.</div>;
  }

  // console.log(filteredFavorites);

  return (
    <div className="FavoritesPage__list">
      {filteredFavorites.map((it) => (
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
        />
      ))}
    </div>
  );
};
