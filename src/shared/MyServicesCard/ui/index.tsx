import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  cover,
  tags = [],
  createdAt,
  workerName = 'Без имени',
  gradient,
  workerAvatar,
  timeAgo,
  onEdit,
  onDelete,
  onToggle,
  onProfile,
  onMessage,
  isToggling,
  isFavorite = false,
}) => {
  const initials = useMemo(() => {
    const parts = workerName.split(' ').filter(Boolean);
    const first = parts[0]?.[0];
    const second = parts[1]?.[0];
    const res = `${first ?? ''}${second ?? ''}`.toUpperCase();
    return res || 'A';
  }, [workerName]);
  const [fav, setFav] = useState<boolean>(Boolean(isFavorite));

  const [avatarSrc, setAvatarSrc] = useState(workerAvatar);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [coverLoaded, setCoverLoaded] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    setAvatarSrc(workerAvatar);
    setAvatarLoaded(false);
    setAvatarError(false);
  }, [workerAvatar]);

  useEffect(() => {
    setCoverLoaded(false);
    setCoverError(false);
  }, [cover]);

  const showAvatarPlaceholder = !avatarSrc || avatarError || !avatarLoaded;
  const showCover = Boolean(cover) && !coverError;

  useEffect(() => {
    setFav(Boolean(isFavorite));
  }, [isFavorite]);

  const handleToggle = useCallback(async () => {
    const next = !fav;
    setFav(next);

    try {
      await onToggle?.(id, next);
    } catch (e) {
      setFav((prev) => !prev);
      console.error('Failed toggle favorite', e);
    }
  }, [fav, id, onToggle, isToggling]);

  return (
    <div className={`MyServiceCard MyServiceCard--${mode}`}>
      <div className="MyServiceCard__left" style={{ background: gradient }}>
        {showCover && (
          <>
            {!coverLoaded && !coverError && (
              <div className="MyServiceCard__cover-loader">
                <CustomLoader size="sm" content="" />
              </div>
            )}
            <img
              className="MyServiceCard__cover"
              src={cover}
              alt={title}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverError(true)}
              style={{ opacity: coverLoaded ? 1 : 0 }}
            />
          </>
        )}
        {!showCover && <div className="MyServiceCard__cover-fallback" />}
        <span className="MyServiceCard__left-text">{title}</span>
      </div>

      <div className="MyServiceCard__center">
        <div className="MyServiceCard__column MyServiceCard__column--top">
          <h4 className="MyServiceCard__title">{title}</h4>

          {mode === 'favorite' && (
            <div className="MyServiceCard__meta">
              {workerName && (
                <>
                  <div className="MyServiceCard__worker">
                    {showAvatarPlaceholder ? (
                      <div className="MyServiceCard__worker-placeholder">{initials}</div>
                    ) : null}
                    {!avatarError && avatarSrc ? (
                      <img
                        className="MyServiceCard__worker-img"
                        src={avatarSrc}
                        alt={workerName}
                        onError={() => setAvatarError(true)}
                        onLoad={() => setAvatarLoaded(true)}
                        style={{ display: showAvatarPlaceholder ? 'none' : 'block' }}
                      />
                    ) : null}
                    <span className="MyServiceCard__worker">{workerName}</span>
                  </div>
                </>
              )}
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
