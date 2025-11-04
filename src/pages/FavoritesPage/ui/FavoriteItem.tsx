import { Button } from 'rsuite';

import './FavoritesPage.scss';
import type { FavoriteItemProps } from '@/pages/FavoritesPage/types';

export const FavoriteItem: React.FC<
  FavoriteItemProps & {
    onRemove?: (id: number) => void;
    onProfile?: (id: number) => void;
    onMessage?: (id: number) => void;
  }
> = ({
  id,
  title,
  description,
  category,
  budget,
  location,
  remoteId,
  image,
  tags = [],
  workerName,
  timeAgo,
  onRemove,
  onProfile,
  onMessage,
}) => (
  <div className="FavoriteItem">
    <div className="FavoriteItem__left">
      {image ? (
        <img className="FavoriteItem__thumb" src={image} alt={title} />
      ) : (
        <div className="FavoriteItem__thumb FavoriteItem__thumb--placeholder" />
      )}
    </div>

    <div className="FavoriteItem__center">
      <div className="FavoriteItem__row FavoriteItem__row--top">
        <h4 className="FavoriteItem__title">{title}</h4>
        <div className="FavoriteItem__meta">
          {workerName && <span className="FavoriteItem__worker">{workerName}</span>}
          {timeAgo && <span className="FavoriteItem__time"> • {timeAgo}</span>}
        </div>
      </div>

      <p className="FavoriteItem__desc">{description}</p>

      <div className="FavoriteItem__info">
        <div className="FavoriteItem__info-col">
          <div className="FavoriteItem__info-label">Категория</div>
          <div className="FavoriteItem__info-value">{category || '—'}</div>
        </div>

        <div className="FavoriteItem__info-col">
          <div className="FavoriteItem__info-label">Бюджет</div>
          <div className="FavoriteItem__info-value">{budget || '—'}</div>
        </div>

        <div className="FavoriteItem__info-col">
          <div className="FavoriteItem__info-label">Локация</div>
          <div className="FavoriteItem__info-value">{location || '—'}</div>
        </div>

        <div className="FavoriteItem__info-col">
          <div className="FavoriteItem__info-label">ID</div>
          <div className="FavoriteItem__info-value">{remoteId || '—'}</div>
        </div>
      </div>
      <div className="FavoriteItem__tags">
        {tags.map((t) => (
          <span key={t} className="FavoriteItem__tag">
            {t}
          </span>
        ))}
      </div>
    </div>

    <div className="FavoriteItem__right">
      <Button
        className="FavoriteItem__removeBtn"
        size="sm"
        appearance="subtle"
        onClick={() => onRemove?.(id)}
        aria-label="Убрать из избранного"
      >
        Убрать
      </Button>

      <div className="FavoriteItem__actions">
        <Button className="FavoriteItem__profileBtn" size="sm" onClick={() => onProfile?.(id)}>
          Профиль
        </Button>
        <Button className="FavoriteItem__messageBtn" size="sm" onClick={() => onMessage?.(id)}>
          Написать
        </Button>
      </div>
    </div>
  </div>
);
