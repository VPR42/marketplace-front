import { ShoppingCart, Camera, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Modal } from 'rsuite';

import type { OrderPlacementModalProps, OrderFormData } from '../types';
import './order-placement-modal.scss';

export const OrderPlacementModal: React.FC<OrderPlacementModalProps> = ({
  open,
  onClose,
  service,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    problemDescription: '',
    address: '',
    desiredDate: '',
    urgency: 'not-urgent',
    photos: [],
    contactPhone: '',
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const handleChange = (
    field: keyof OrderFormData,
    value: string | 'not-urgent' | 'urgent' | File[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="OrderPlacementModal" size="lg">
      <Modal.Header className="OrderPlacementModal__header">
        <ShoppingCart className="OrderPlacementModal__header-icon" size={24} />
        <h2 className="OrderPlacementModal__title">Оформление заказа</h2>
      </Modal.Header>

      <Modal.Body className="OrderPlacementModal__body">
        {/* Баннер услуги */}
        <div className="OrderPlacementModal__service-banner">{service.title}</div>

        {/* Информация об услуге */}
        <div>
          <h3 className="OrderPlacementModal__service-title">{service.title}</h3>
          <div className="OrderPlacementModal__service-worker">{service.workerName}</div>

          {/* Теги услуги */}
          {service.tags && service.tags.length > 0 && (
            <div className="OrderPlacementModal__service-tags">
              {service.category && (
                <span className="OrderPlacementModal__service-tag">👤 {service.category}</span>
              )}
              {service.tags.map((tag, index) => (
                <span key={index} className="OrderPlacementModal__service-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Поле стоимости */}
          <div className="OrderPlacementModal__cost-input">
            <label className="OrderPlacementModal__label">Стоимость</label>
            <input
              className="OrderPlacementModal__input"
              type="text"
              value={service.price ? `от ${service.price} ₽` : ''}
              readOnly
            />
          </div>
        </div>

        {/* Форма */}
        <form className="OrderPlacementModal__form">
          {/* Описание проблемы */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label OrderPlacementModal__label--required">
              Описание проблемы
            </label>
            <textarea
              className="OrderPlacementModal__textarea"
              placeholder="Опишите вашу проблему..."
              value={formData.problemDescription}
              onChange={(e) => handleChange('problemDescription', e.target.value)}
            />
          </div>

          {/* Адрес */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label OrderPlacementModal__label--required">
              Адрес выполнения
            </label>
            <input
              className="OrderPlacementModal__input"
              type="text"
              placeholder="Введите адрес..."
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {/* Желаемая дата */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label">Желаемая дата</label>
            <input
              className="OrderPlacementModal__input"
              type="date"
              value={formData.desiredDate}
              onChange={(e) => handleChange('desiredDate', e.target.value)}
            />
          </div>

          {/* Срочность */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label">Срочность</label>
            <div className="OrderPlacementModal__urgency-group">
              <button
                type="button"
                className={`OrderPlacementModal__urgency-btn ${
                  formData.urgency === 'not-urgent'
                    ? 'OrderPlacementModal__urgency-btn--active'
                    : ''
                }`}
                onClick={() => handleChange('urgency', 'not-urgent')}
              >
                Не срочно
              </button>
              <button
                type="button"
                className={`OrderPlacementModal__urgency-btn ${
                  formData.urgency === 'urgent' ? 'OrderPlacementModal__urgency-btn--active' : ''
                }`}
                onClick={() => handleChange('urgency', 'urgent')}
              >
                Срочно
              </button>
            </div>
          </div>

          {/* Загрузка фото */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label">Прикрепить фото (опционально)</label>
            <label htmlFor="photo-upload" className="OrderPlacementModal__photo-upload">
              <input
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedPhotos(files);
                  handleChange('photos', files);
                }}
              />
              <Camera className="OrderPlacementModal__photo-icon" size={32} />
              <p className="OrderPlacementModal__photo-text">Фото проблемы помогут мастеру</p>
              <p className="OrderPlacementModal__photo-hint">Нажмите для загрузки</p>
            </label>
            {selectedPhotos.length > 0 && (
              <p style={{ fontSize: '12px', color: '#7a859e', marginTop: '8px' }}>
                Выбрано файлов: {selectedPhotos.length}
              </p>
            )}
          </div>

          {/* Контактный телефон */}
          <div className="OrderPlacementModal__form-group">
            <label className="OrderPlacementModal__label OrderPlacementModal__label--required">
              Контактный телефон
            </label>
            <input
              className="OrderPlacementModal__input"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
          </div>
        </form>

        {/* Как это работает */}
        <div className="OrderPlacementModal__how-it-works">
          <div className="OrderPlacementModal__how-it-works-title">
            <Lightbulb size={16} />
            Как это работает
          </div>
          <ul className="OrderPlacementModal__how-it-works-list">
            <li className="OrderPlacementModal__how-it-works-item">Мастер получит ваш запрос</li>
            <li className="OrderPlacementModal__how-it-works-item">
              Свяжется с вами для уточнения деталей
            </li>
            <li className="OrderPlacementModal__how-it-works-item">
              После согласования приедет и выполнит работу
            </li>
            <li className="OrderPlacementModal__how-it-works-item">Оплата после завершения</li>
          </ul>
        </div>
      </Modal.Body>

      <Modal.Footer className="OrderPlacementModal__footer">
        <button className="OrderPlacementModal__cancel-btn" onClick={onClose}>
          Отмена
        </button>
        <button className="OrderPlacementModal__submit-btn" onClick={handleSubmit}>
          Отправить заказ
        </button>
      </Modal.Footer>
    </Modal>
  );
};
