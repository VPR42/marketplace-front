import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Modal } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';

import type { ServiceDetailModalProps } from '../types';

import './service-detail-modal.scss';

const getInitialsFromTitle = (title: string) => {
  const parts = title.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return title.substring(0, 2).toUpperCase();
};

const ActionBar: React.FC<ServiceDetailModalProps & { getInitials: (name: string) => string }> = ({
  mode,
  service,
  onOrder,
  onMessage,
  onFavorite,
  isFavorite,
  getInitials,
  isTogglingFavorite,
}) => {
  const navigate = useNavigate();

  const handleGoToMasterProfile = () => {
    console.log(service);
    navigate(`/profile/${service.user?.id}`);
  };

  return (
    <div className="ServiceDetailModal__action-bar">
      <div className="ServiceDetailModal__price-and-favorite">
        <div className="ServiceDetailModal__price-top">
          <div className="ServiceDetailModal__price">
            <div className="ServiceDetailModal__price-label">Стоимость</div>
            <div className="ServiceDetailModal__price-value ServiceDetailModal__price-value--dark">
              от {service.price} ₽
            </div>
          </div>
        </div>
        {mode === 'service' && (

          <button
            className={`ServiceDetailModal__favorite-btn ${isFavorite ? 'ServiceDetailModal__favorite-btn--active' : ''}`}
            onClick={onFavorite}
            disabled={isTogglingFavorite}
          >
            <Heart
              className="ServiceDetailModal__favorite-icon"
              size={16}
              fill={isFavorite ? '#fff' : 'transparent'}
            />
            <span className="ServiceDetailModal__favorite-label">
              {isTogglingFavorite ? (
                <CustomLoader size="xs" />
              ) : isFavorite ? (
                'В избранном'
              ) : (
                'В избранное'
              )}
            </span>
          </button>
        )}
      </div>

      <div className="ServiceDetailModal__actions">
        <button className="ServiceDetailModal__message-btn" onClick={onMessage}>
          Написать мастеру
        </button>
        {mode === 'service' && (
          <button className="ServiceDetailModal__order-btn" onClick={onOrder}>
            Заказать
          </button>
        )}

      </div>

      <div className="ServiceDetailModal__master-container">
        <div className="ServiceDetailModal__master">
          <div className="ServiceDetailModal__master-avatar">{getInitials(service.workerName)}</div>
          <div className="ServiceDetailModal__master-info">
            <div className="ServiceDetailModal__master-name">{service.workerName}</div>
            {service.experience && (
              <div className="ServiceDetailModal__master-experience">{service.experience}</div>
            )}
          </div>
        </div>
        <div className="ServiceDetailModal__master-actions">
          <button className="ServiceDetailModal__master-btn" onClick={handleGoToMasterProfile}>
            Профиль
          </button>
          <button className="ServiceDetailModal__master-btn">Написать</button>
        </div>

      </div>
    </div>
  );
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  mode = 'service',
  open,
  onClose,
  service,
  onOrder,
  onMessage,
  onFavorite,
  isFavorite = false,
  isTogglingFavorite = false,
}) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // const masterTags = ['Опыт 6 лет', 'Работаю по договору', 'Безналичный расчет', 'Выезд сегодня'];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(service.coverUrl) && !imageError;

  return (
    <Modal open={open} onClose={onClose} className="ServiceDetailModal" size="lg">
      <Modal.Header className="ServiceDetailModal__header">
        <div style={{ flex: 1 }}>
          {service.category && (
            <span className="ServiceDetailModal__category">{service.category}</span>
          )}
          <h2 className="ServiceDetailModal__title">{service.title}</h2>
        </div>
      </Modal.Header>

      <Modal.Body className="ServiceDetailModal__body">
        <div className="ServiceDetailModal__top">
          <div className="ServiceDetailModal__main-content" style={{ minWidth: 0 }}>
            <div
              className="ServiceDetailModal__image"
              style={{ background: service.gradient || '#e5e7eb' }}
            >
              {hasImage ? (
                <>
                  {!imageLoaded && (
                    <div className="ServiceDetailModal__image-loader">
                      <CustomLoader size="md" content="" />
                    </div>
                  )}
                  <img
                    src={service.coverUrl}
                    alt={service.title}
                    className="ServiceDetailModal__image-img"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                  />
                </>
              ) : (
                <div className="ServiceDetailModal__image-placeholder">
                  {getInitialsFromTitle(service.title)}
                </div>
              )}
            </div>
          </div>

          <ActionBar
            mode={mode}
            service={service}
            onOrder={onOrder}
            onMessage={onMessage}
            onFavorite={onFavorite}
            isFavorite={isFavorite}
            getInitials={getInitials}
            isTogglingFavorite={isTogglingFavorite}
            open={open}
            onClose={onClose}
          />
        </div>

        <div className="ServiceDetailModal__bottom">
          <div className="ServiceDetailModal__description-grid">
            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Выполнено</div>
              <div className="ServiceDetailModal__stat-value">312 заказов</div>
            </div>
            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Локация</div>
              <div className="ServiceDetailModal__stat-value">
                {service.location || 'Город не указан'}
              </div>
            </div>
          </div>

          <div className="ServiceDetailModal__description-title">Описание</div>
          <div className="ServiceDetailModal__description-text">{service.description}</div>

          {service.tags && service.tags.length > 0 && (
            <div className="ServiceDetailModal__master-tags">
              {service.tags.map((tag) => (
                <span key={tag} className="ServiceDetailModal__master-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
