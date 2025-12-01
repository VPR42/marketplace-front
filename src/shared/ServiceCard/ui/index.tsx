import { useEffect, useMemo, useState } from 'react';
import { Loader } from 'rsuite';

import type { ServiceCardProps } from '@/shared/ServiceCard/types';

import './service-card.scss';

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  orders,
  gradient,
  coverUrl,
  workerName = 'Без имени',
  workerAvatar,
  favorite,
  onClick,
}) => {
  const initials = useMemo(() => {
    const parts = workerName.split(' ').filter(Boolean);
    const first = parts[0]?.[0];
    const second = parts[1]?.[0];
    const res = `${first ?? ''}${second ?? ''}`.toUpperCase();
    return res || 'A';
  }, [workerName]);

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
  }, [coverUrl]);

  const showAvatarPlaceholder = !avatarSrc || avatarError || !avatarLoaded;
  const showCover = Boolean(coverUrl) && !coverError;

  return (
    <div className="ServiceCard" onClick={onClick}>
      <div className="ServiceCard__top" style={{ background: gradient }}>
        {showCover && (
          <>
            {!coverLoaded && !coverError && (
              <div className="ServiceCard__cover-loader">
                <Loader size="sm" content="" />
              </div>
            )}
            <img
              className="ServiceCard__cover"
              src={coverUrl}
              alt={title}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverError(true)}
              style={{ opacity: coverLoaded ? 1 : 0 }}
            />
          </>
        )}
        {!showCover && <div className="ServiceCard__cover-fallback" />}
        <span className="ServiceCard__top-text">{title}</span>
        {favorite ? <span className="ServiceCard__fav">❤</span> : null}
      </div>
      <div className="ServiceCard__body">
        <div className="ServiceCard__content">
          <h3 className="ServiceCard__title">{title}</h3>

          <div className="ServiceCard__worker">
            {showAvatarPlaceholder ? (
              <div className="ServiceCard__worker-placeholder">{initials}</div>
            ) : null}
            {!avatarError && avatarSrc ? (
              <img
                className="ServiceCard__worker-img"
                src={avatarSrc}
                alt={workerName}
                onError={() => setAvatarError(true)}
                onLoad={() => setAvatarLoaded(true)}
                style={{ display: showAvatarPlaceholder ? 'none' : 'block' }}
              />
            ) : null}
            <span className="ServiceCard__worker-name">{workerName}</span>
          </div>

          <p className="ServiceCard__description">{description}</p>
        </div>
        <div className="ServiceCard__footer">
          <span className="ServiceCard__price">от {price}₽</span>
          <span className="ServiceCard__orders">{orders} заказов</span>
        </div>
      </div>
    </div>
  );
};
