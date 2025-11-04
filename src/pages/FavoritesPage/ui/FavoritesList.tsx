import './FavoritesPage.scss';
import { favorites } from '@/shared/data/favorites';

import { FavoriteItem } from './FavoriteItem';

export const FavoritesList: React.FC = () => {
  const handleRemove = (id: number) => {
    console.log('убрано', id);
    // TODO: надо крч сделать эээ в редакс чтобы да или к апишке запрос хуй его крч
  };

  const handleProfile = (id: number) => {
    console.log('профиль', id);
  };

  const handleMessage = (id: number) => {
    console.log('написать', id);
  };

  return (
    <div className="FavoritesPage__list">
      {favorites.map((it) => (
        <FavoriteItem
          key={it.id}
          {...it}
          onRemove={handleRemove}
          onProfile={handleProfile}
          onMessage={handleMessage}
        />
      ))}
    </div>
  );
};
