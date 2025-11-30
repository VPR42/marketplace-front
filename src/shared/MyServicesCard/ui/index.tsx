import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'rsuite';

import './my-services-card.scss';
import { CustomLoader } from '@/components/CustomLoader/ui';
import type { MyServiceCardProps } from '@/shared/MyServicesCard/types';

import { Heart } from 'lucide-react';

export const MyServiceCard: React.FC<MyServiceCardProps> = ({
  mode,
  id,
  title,
  description,
  category,
  price,
  location,
  image,
  tags = [],
  createdAt,
  workerName,
  timeAgo,
  onEdit,
  onDelete,
  onToggle,
  onProfile,
  onMessage,
  isFavorite = false,
}) => {
  const [fav, setFav] = useState<boolean>(Boolean(isFavorite));
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setFav(Boolean(isFavorite));
  }, [isFavorite]);

  const handleToggle = useCallback(async () => {
    const next = !fav;
    setFav(next);
    setIsToggling(true);

    try {
      await onToggle?.(id, next);
    } catch (e) {
      setFav((prev) => !prev);
      console.error('Failed toggle favorite', e);
    } finally {
      setIsToggling(false);
    }
  }, [fav, id, onToggle]);

  return (
    <div className={`MyServiceCard MyServiceCard--${mode}`}>
      <div className="MyServiceCard__left">
        {image ? (
          <img className="MyServiceCard__thumb" src={image} alt={title} />
        ) : (
          <div className="MyServiceCard__thumb MyServiceCard__thumb--placeholder" />
        )}
      </div>

      <div className="MyServiceCard__center">
        <div className="MyServiceCard__column MyServiceCard__column--top">
          <h4 className="MyServiceCard__title">{title}</h4>

          {mode === 'favorite' && (
            <div className="MyServiceCard__meta">
              {workerName && <span className="MyServiceCard__worker">{workerName}</span>}
              {timeAgo && <span className="MyServiceCard__time"> • {timeAgo}</span>}
            </div>
          )}
        </div>

        {createdAt && mode === 'my' && (
          <p className="MyServiceCard__created">Создано {createdAt}</p>
        )}

        <p className="MyServiceCard__desc">{description}</p>

        <div className="MyServiceCard__info">
          <div className="MyServiceCard__info-col">
            <div className="MyServiceCard__info-label">Категория</div>
            <div className="MyServiceCard__info-value">{category || '—'}</div>
          </div>

          <div className="MyServiceCard__info-col">
            <div className="MyServiceCard__info-label">Цена</div>
            <div className="MyServiceCard__info-value">{price ? `${price} ₽/час` : '—'}</div>
          </div>

          <div className="MyServiceCard__info-col">
            <div className="MyServiceCard__info-label">Локация</div>
            <div className="MyServiceCard__info-value">{location || '—'}</div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="MyServiceCard__tags">
            {tags.map((t) => (
              <span key={t} className="MyServiceCard__tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="MyServiceCard__right">
        {mode === 'favorite' ? (
          <>
            <Button
              className={`MyServiceCard__removeBtn ${fav ? 'fav' : ''}`}
              size="sm"
              appearance="subtle"
              onClick={handleToggle}
              disabled={isToggling}
              title={fav ? 'Убрать из избранного' : 'В избранное'}
            >
              {isToggling ? (
                <CustomLoader size="xs" />
              ) : (
                <Heart
                  size={16}
                  fill={fav ? 'var(--orange)' : 'none'}
                  stroke={fav ? 'var(--orange)' : 'gray'}
                />
              )}
            </Button>

            <div className="MyServiceCard__actions">
              <Button
                className="MyServiceCard__profileBtn"
                size="sm"
                onClick={() => onProfile?.(id)}
              >
                Профиль
              </Button>
              <Button className="MyServiceCard__writeBtn" size="sm" onClick={() => onMessage?.(id)}>
                Написать
              </Button>
            </div>
          </>
        ) : (
          <div className="MyServiceCard__right--my">
            <div className="MyServiceCard__actions--my">
              <Button className="MyServiceCard__editBtn" onClick={() => onEdit?.(id)}>
                Редактировать
              </Button>
              <Button className="MyServiceCard__deleteBtn" onClick={() => onDelete?.(id)}>
                Удалить
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
