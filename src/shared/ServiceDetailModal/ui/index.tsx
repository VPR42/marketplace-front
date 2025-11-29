import { Heart } from 'lucide-react';
import { Modal } from 'rsuite';

import type { ServiceDetailModalProps } from '../types';
import './service-detail-modal.scss';

// Компонент для блока действий (Action Bar) справа
const ActionBar: React.FC<ServiceDetailModalProps & { getInitials: (name: string) => string }> = ({
  service,
  onOrder,
  onMessage,
  onFavorite,
  isFavorite,
  getInitials,
}) => (
  <div className="ServiceDetailModal__action-bar">
    {/* 1. Блок стоимости и избранного */}
    <div className="ServiceDetailModal__price-and-favorite">
      <div className="ServiceDetailModal__price-top">
        <div className="ServiceDetailModal__price">
          <div className="ServiceDetailModal__price-label">Стоимость</div>
          <div className="ServiceDetailModal__price-value ServiceDetailModal__price-value--dark">
            от {service.price} ₽
          </div>
        </div>

        <button
          className={`ServiceDetailModal__favorite-btn ${isFavorite ? 'ServiceDetailModal__favorite-btn--active' : ''}`}
          onClick={onFavorite}
        >
          <Heart size={16} fill={isFavorite ? '#fff' : 'transparent'} />
          {isFavorite ? 'В избранном' : 'В избранное'}
        </button>
      </div>

      <div className="ServiceDetailModal__actions">
        <button className="ServiceDetailModal__message-btn" onClick={onMessage}>
          Написать мастеру
        </button>
        <button className="ServiceDetailModal__order-btn" onClick={onOrder}>
          Заказать
        </button>
      </div>
    </div>

    {/* 3. Информация о мастере */}
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
        <button className="ServiceDetailModal__master-btn">Профиль</button>
        <button className="ServiceDetailModal__master-btn">Все услуги</button>
      </div>
    </div>
  </div>
);

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  open,
  onClose,
  service,
  onOrder,
  onMessage,
  onFavorite,
  isFavorite = false,
}) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    // Если имя состоит из одного слова, берем первые две буквы
    return name.substring(0, 2).toUpperCase();
  };

  const masterTags = ['Гарантия 6 месяцев', 'Чек и договор', 'Безнал/Наличные', 'Выезд сегодня'];

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
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="ServiceDetailModal__main-content">
            <div className="ServiceDetailModal__image" />
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <ActionBar
            service={service}
            onOrder={onOrder}
            onMessage={onMessage}
            onFavorite={onFavorite}
            isFavorite={isFavorite}
            getInitials={getInitials}
            open={open}
            onClose={onClose}
          />
        </div>

        {/* НИЖНИЙ БЛОК */}
        <div className="ServiceDetailModal__bottom">
          <div className="ServiceDetailModal__description-grid">
            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Выполнено</div>
              <div className="ServiceDetailModal__stat-value">312 заказов</div>
            </div>
            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Район</div>
              <div className="ServiceDetailModal__stat-value">
                {service.location || 'Москва, весь город'}
              </div>
            </div>
          </div>

          <div className="ServiceDetailModal__description-title">Описание</div>
          <div className="ServiceDetailModal__description-text">{service.description}</div>

          <div className="ServiceDetailModal__master-tags">
            {masterTags.map((tag) => (
              <span key={tag} className="ServiceDetailModal__master-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
