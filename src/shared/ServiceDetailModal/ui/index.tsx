import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { setCurrentChat } from '@/redux-rtk/store/chats/chatsSlice';
import { createChat } from '@/redux-rtk/store/chats/chatsThunks';
import { fetchProfileById } from '@/redux-rtk/store/profile/profileThunks';

import type { ServiceDetailModalProps } from '../types';

import './service-detail-modal.scss';

const getInitialsFromTitle = (title: string) => {
  const parts = title.split(' ').filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return title.substring(0, 2).toUpperCase();
};

type ActionBarProps = ServiceDetailModalProps & {
  getInitials: (name: string) => string;

  creatingChat: boolean;

  onMessageInternal: () => void;

  onGoToProfile: () => void;

  onOrderClick: () => void;

  orderLoading: boolean;
};

const ActionBar: React.FC<ActionBarProps> = ({
  mode,
  disableActions,
  service,
  onFavorite,
  isFavorite,
  getInitials,
  isTogglingFavorite,
  orderLoading,
  creatingChat,
  onMessageInternal,
  onOrderClick,
}) => {
  const navigate = useNavigate();

  const handleGoToMasterProfile = () => {
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

        {mode === 'service' && !disableActions && (
          <div className="ServiceDetailModal__actions ServiceDetailModal__actions--top">
            <button
              className="ServiceDetailModal__message-btn"
              onClick={onMessageInternal}
              disabled={creatingChat}
            >
              {creatingChat ? <CustomLoader size="xs" /> : 'Написать мастеру'}
            </button>

            <button
              className="ServiceDetailModal__order-btn"
              onClick={onOrderClick}
              disabled={orderLoading}
            >
              Заказать
            </button>
          </div>
        )}

        {mode === 'service' && !disableActions && (
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
        </div>
      </div>
    </div>
  );
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  mode = 'service',

  open,

  onClose,

  disableActions = false,

  service,

  onOrder,

  onMessage,

  onFavorite,

  isFavorite = false,

  isTogglingFavorite = false,

  isCreatingOrder = false,

  onGoToOrders,
}) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const parts = name.split(' ');

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  const { data: profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (service.user?.id) {
      dispatch(fetchProfileById(service.user?.id));
    }
  }, [dispatch, service.user?.id]);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [imageError, setImageError] = useState(false);

  const [creatingChat, setCreatingChat] = useState(false);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const hasImage = Boolean(service.coverUrl) && !imageError;

  const handleMessageInternal = async () => {
    if (onMessage) {
      onMessage();

      return;
    }

    if (!service.id) {
      return;
    }

    try {
      setCreatingChat(true);

      const res = await dispatch(createChat({ serviceId: service.id })).unwrap();

      dispatch(setCurrentChat(res.chatId));

      navigate('/chats');
    } catch {
      // можно показать тост/сообщение
    } finally {
      setCreatingChat(false);
    }
  };

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
            disableActions={disableActions}
            service={service}
            onFavorite={onFavorite}
            isFavorite={isFavorite}
            getInitials={getInitials}
            isTogglingFavorite={isTogglingFavorite}
            open={open}
            onClose={onClose}
            onMessage={onMessage}
            creatingChat={creatingChat}
            onMessageInternal={handleMessageInternal}
            onGoToProfile={() => {}}
            onOrderClick={() => setShowOrderPreview(true)}
            orderLoading={isCreatingOrder || orderSubmitting}
          />
        </div>

        <div className="ServiceDetailModal__bottom">
          <div className="ServiceDetailModal__description-grid">
            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Выполнено</div>

              <div className="ServiceDetailModal__stat-value">
                {profile?.orders.ordersCount} заказов
              </div>
            </div>

            <div className="ServiceDetailModal__stat-item">
              <div className="ServiceDetailModal__stat-label">Локация</div>

              <div className="ServiceDetailModal__stat-value">
                {service.location || 'Не указано'}
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

      <Modal
        open={showOrderPreview}
        onClose={() => setShowOrderPreview(false)}
        className="ServiceDetailModal__order-preview"
        size="md"
        onExited={() => setOrderError(null)}
      >
        <Modal.Header>
          <Modal.Title>Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ServiceDetailModal__preview-card">
            <div
              className="ServiceDetailModal__preview-cover"
              style={{ background: hasImage ? 'transparent' : service.gradient || '#e5e7eb' }}
            >
              {hasImage ? (
                <img src={service.coverUrl} alt={service.title} />
              ) : (
                <span>{getInitialsFromTitle(service.title)}</span>
              )}
            </div>
            <div className="ServiceDetailModal__preview-content">
              <div className="ServiceDetailModal__preview-title">{service.title}</div>
              <div className="ServiceDetailModal__preview-meta">
                <span>{service.workerName}</span>
                {service.workerRating &&
                  service.workerRating !== '-' &&
                  service.workerRating !== '—' && <span>{service.workerRating}</span>}
              </div>
              {service.tags && service.tags.length > 0 && (
                <div className="ServiceDetailModal__preview-badges">
                  {service.tags.map((tag) => (
                    <span key={tag} className="ServiceDetailModal__preview-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="ServiceDetailModal__preview-price">
                <span className="ServiceDetailModal__preview-price-label">Стоимость</span>
                <span className="ServiceDetailModal__preview-price-value">
                  от {service.price} ₽
                </span>
              </div>
            </div>
          </div>
          <div className="ServiceDetailModal__preview-info">
            <strong>ℹ️ Информация</strong>
            <span>Мастер свяжется с вами в течение 30 минут для уточнения деталей.</span>
          </div>

          {orderError && <div className="ServiceDetailModal__preview-error">{orderError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="ServiceDetailModal__preview-btn ServiceDetailModal__preview-btn--secondary"
            onClick={() => setShowOrderPreview(false)}
            disabled={isCreatingOrder}
          >
            Назад
          </button>
          <button
            className="ServiceDetailModal__preview-btn ServiceDetailModal__preview-btn--primary"
            onClick={async () => {
              if (orderSubmitting || isCreatingOrder) {
                return;
              }
              if (!onOrder) {
                setShowOrderPreview(false);
                setShowOrderSuccess(true);
                return;
              }
              setOrderError(null);
              setOrderSubmitting(true);
              try {
                await Promise.resolve(onOrder());
                setShowOrderPreview(false);
                setShowOrderSuccess(true);
              } catch (err) {
                setOrderError('Не удалось создать заказ. Попробуйте ещё раз.');
              } finally {
                setOrderSubmitting(false);
              }
            }}
            disabled={orderSubmitting || isCreatingOrder}
          >
            {orderSubmitting || isCreatingOrder ? <CustomLoader size="xs" /> : 'Подтвердить заказ'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        open={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        className="ServiceDetailModal__status-modal"
        size="sm"
      >
        <button
          className="ServiceDetailModal__status-close"
          onClick={() => setShowOrderSuccess(false)}
        >
          ✕
        </button>

        <div className="ServiceDetailModal__status-body">
          <div className="ServiceDetailModal__status-icon ServiceDetailModal__status-icon--success">
            ✓
          </div>
          <h3 className="ServiceDetailModal__status-title">Заявка отправлена</h3>
          <p className="ServiceDetailModal__status-text">
            Мастер свяжется с вами в течение 30 минут для уточнения деталей.
          </p>
        </div>

        <div className="ServiceDetailModal__status-info">
          <strong>📱 Что дальше?</strong>
          Вы получите звонок или сообщение от мастера. Мы отправили подтверждение на ваш номер
          телефона.
        </div>

        <div className="ServiceDetailModal__status-footer">
          <button
            className="ServiceDetailModal__status-btn ServiceDetailModal__status-btn--secondary"
            onClick={() => setShowOrderSuccess(false)}
          >
            Закрыть
          </button>
          <button
            className="ServiceDetailModal__status-btn ServiceDetailModal__status-btn--primary"
            onClick={() => {
              setShowOrderSuccess(false);
              onGoToOrders?.();
            }}
          >
            Перейти в мои заказы →
          </button>
        </div>
      </Modal>
    </Modal>
  );
};
