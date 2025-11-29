import { MyServiceCard } from '@/shared/MyServicesCard/ui';
import './FavoritesPage.scss';
import { favorites } from '@/shared/data/favorites';

export const FavoritesList: React.FC = () => {
  const handleRemove = (id: string) => {
    console.log('убрано', id);
    // TODO: надо крч сделать эээ в редакс чтобы да или к апишке запрос хуй его крч
  };

  const handleProfile = (id: string) => {
    console.log('профиль', id);
  };

  const handleMessage = (id: string) => {
    console.log('написать', id);
  };

  return (
    <div className="FavoritesPage__list">
      {favorites.map((it) => (
        <MyServiceCard
          mode="favorite"
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
