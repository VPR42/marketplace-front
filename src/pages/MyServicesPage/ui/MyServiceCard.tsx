import React from 'react';
import { Button, Tag } from 'rsuite';

import './my-services.scss';
import type { MyService } from '@/pages/MyServicesPage/types';

export const MyServiceCard: React.FC<MyService> = ({
  id,
  title,
  description,
  price,
  location,
  views,
  requests,
  activeOrders,
  image,
  createdAt,
  category,
  status,
}) => (
  <div className="MyServiceCard">
    <img src={image} className="MyServiceCard__photo" alt="Фото услуги" />

    <div className="MyServiceCard__content">
      <div className="MyServiceCard__header">
        <h4 className="MyServiceCard__title">{title}</h4>
        {status && (
          <Tag
            color={
              status === 'Активна'
                ? 'green'
                : status === 'Отклонена'
                  ? 'red'
                  : status === 'На модерации'
                    ? 'orange'
                    : undefined
            }
            className="MyServiceCard__status"
          >
            {status}
          </Tag>
        )}
      </div>

      <p className="MyServiceCard__created">Создано {createdAt}</p>
      <p className="MyServiceCard__description">{description}</p>

      <div className="MyServiceCard__info">
        <div className="MyServiceCard__info-col">
          <div className="MyServiceCard__info-label">Категория</div>
          <div className="MyServiceCard__info-value">{category || '—'}</div>
        </div>
        <div className="MyServiceCard__info-col">
          <div className="MyServiceCard__info-label">Цена</div>
          <div className="MyServiceCard__info-value">{price || '-'} ₽/час</div>
        </div>
        <div className="MyServiceCard__info-col">
          <div className="MyServiceCard__info-label">Локация</div>
          <div className="MyServiceCard__info-value">{location || '-'}</div>
        </div>
        <div className="MyServiceCard__info-col">
          <div className="MyServiceCard__info-label">ID услуги</div>
          <div className="MyServiceCard__info-value">{id || '-'}</div>
        </div>
      </div>
      <div className="MyServiceCard__footer">
        <div className="MyServiceCard__stats">
          <span>👁 {views} просмотров</span>
          <span>💬 {requests} запросов</span>
          <span>✓ {activeOrders} активных заказов</span>
        </div>

        <div className="MyServiceCard__actions">
          <Button className="MyServiceCard__editBtn">Редактировать</Button>
          <Button className="MyServiceCard__statBtn">Статистика</Button>
          <Button className="MyServiceCard__deleteBtn">Удалить</Button>
        </div>
      </div>
    </div>
  </div>
);
