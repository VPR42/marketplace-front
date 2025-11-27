import { useEffect, useMemo, useState } from 'react';

import './service-card.scss';
import type { ServiceCardProps } from '@/shared/ServiceCard/types';

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  orders,
  gradient,
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
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setAvatarSrc(workerAvatar);
    setFallback(false);
    const timer = setTimeout(() => setFallback(true), 5000);
    return () => clearTimeout(timer);
  }, [workerAvatar]);

  const handleError = () => {
    setFallback(true);
  };

  return (
    <div className="ServiceCard" onClick={onClick}>
      <div className="ServiceCard__top" style={{ background: gradient }}>
        <span className="ServiceCard__top-text">{title}</span>
        {favorite ? <span className="ServiceCard__fav">❤</span> : null}
      </div>
      <div className="ServiceCard__body">
        <div className="ServiceCard__content">
          <h3 className="ServiceCard__title">{title}</h3>

          <div className="ServiceCard__worker">
            {fallback || !avatarSrc ? (
              <div className="ServiceCard__worker-placeholder">{initials}</div>
            ) : (
              <img
                className="ServiceCard__worker-img"
                src={avatarSrc}
                alt={workerName}
                onError={handleError}
              />
            )}
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
