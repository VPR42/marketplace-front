import { useMemo, useState } from 'react';
import { Modal } from 'rsuite';

import './order-create-modal.scss';

interface ServicePreview {
  title: string;
  workerName: string;
  price?: number;
  tags?: string[];
  location?: string;
  image?: string;
  gradient?: string;
  rating?: number;
  reviews?: number;
  category?: string;
}

interface OrderCreateModalProps {
  open: boolean;
  service: ServicePreview;
  onClose: () => void;
  onSubmit: (payload: {
    description: string;
    address: string;
    date?: string;
    phone: string;
  }) => void;
  onBack?: () => void;
}

export const OrderCreateModal: React.FC<OrderCreateModalProps> = ({
  open,
  service,
  onClose,
  onSubmit,
  onBack,
}) => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(service.location || '');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(() => {
    const result: Record<string, string> = {};
    const selectedDate = date ? new Date(date) : null;

    if (!description.trim()) {
      result.description = 'Опишите задачу';
    }

    if (!address.trim()) {
      result.address = 'Укажите адрес';
    }

    if (!phone.trim()) {
      result.phone = 'Укажите телефон';
    }

    if (!date) {
      result.date = 'Укажите дату';
    } else if (selectedDate && !Number.isNaN(selectedDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        result.date = 'Выберите дату позже сегодняшней';
      }
    }

    return result;
  }, [address, date, description, phone]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = () => {
    setShowErrors(true);

    if (!isValid) {
      setShowErrors(true);
      return;
    }

    onSubmit({
      description: description.trim(),
      address: address.trim(),
      date: date || undefined,
      phone: phone.trim(),
    });
  };

  const { title, workerName, price, tags = [], image, gradient, rating, reviews } = service;

  return (
    <Modal open={open} onClose={onClose} className="OrderCreateModal" size="md">
      <Modal.Header>
        <Modal.Title>Оформление заказа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="OrderCreateModal__preview">
          <div
            className={`OrderCreateModal__image ${image ? '' : 'OrderCreateModal__image--empty'}`}
            style={
              image
                ? { backgroundImage: `url(${image})` }
                : gradient
                  ? { background: gradient }
                  : undefined
            }
          >
            {!image && !gradient && 'Фото услуги'}
          </div>
          <div className="OrderCreateModal__info">
            <div className="OrderCreateModal__title">{title}</div>
            <div className="OrderCreateModal__meta">
              <span>{workerName}</span>
              {(rating || reviews) && (
                <span className="OrderCreateModal__rating">
                  {rating ? `★ ${rating}` : ''} {reviews ? `(${reviews})` : ''}
                </span>
              )}
            </div>
            {tags.length > 0 && (
              <div className="OrderCreateModal__tags">
                {tags.map((tag) => (
                  <span key={tag} className="OrderCreateModal__tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="OrderCreateModal__priceBox">
              <span className="OrderCreateModal__priceLabel">Стоимость</span>
              {price !== undefined && (
                <span className="OrderCreateModal__price">{price.toLocaleString('ru-RU')} ₽</span>
              )}
            </div>
          </div>
        </div>

        <div className="OrderCreateModal__field">
          <label className="OrderCreateModal__label">Описание работ *</label>
          <textarea
            className={`OrderCreateModal__textarea ${
              showErrors && errors.description ? 'OrderCreateModal__input--error' : ''
            }`}
            placeholder="Опишите, что нужно сделать..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {showErrors && errors.description && (
            <span className="OrderCreateModal__error">{errors.description}</span>
          )}
        </div>

        <div className="OrderCreateModal__row">
          <div className="OrderCreateModal__field">
            <label className="OrderCreateModal__label">Адрес *</label>
            <input
              className={`OrderCreateModal__input ${
                showErrors && errors.address ? 'OrderCreateModal__input--error' : ''
              }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, дом"
            />
            {showErrors && errors.address && (
              <span className="OrderCreateModal__error">{errors.address}</span>
            )}
          </div>
          <div className="OrderCreateModal__field">
            <label className="OrderCreateModal__label">Дата</label>
            <input
              className={`OrderCreateModal__input ${
                showErrors && errors.date ? 'OrderCreateModal__input--error' : ''
              }`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {showErrors && errors.date && (
              <span className="OrderCreateModal__error">{errors.date}</span>
            )}
          </div>
        </div>

        <div className="OrderCreateModal__field">
          <label className="OrderCreateModal__label">Контактный телефон *</label>
          <input
            className={`OrderCreateModal__input ${
              showErrors && errors.phone ? 'OrderCreateModal__input--error' : ''
            }`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
          />
          {showErrors && errors.phone && (
            <span className="OrderCreateModal__error">{errors.phone}</span>
          )}
        </div>

        <div className="OrderCreateModal__infoBox">
          <strong>ℹ️ Информация</strong>
          Мастер свяжется с вами в течение 30 минут для уточнения деталей
        </div>
      </Modal.Body>
      <Modal.Footer>
        {onBack && (
          <button
            type="button"
            className="OrderCreateModal__btn OrderCreateModal__btn--ghost"
            onClick={onBack}
          >
            Назад
          </button>
        )}
        <button
          type="button"
          className="OrderCreateModal__btn OrderCreateModal__btn--primary"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Отправить запрос →
        </button>
      </Modal.Footer>
    </Modal>
  );
};
