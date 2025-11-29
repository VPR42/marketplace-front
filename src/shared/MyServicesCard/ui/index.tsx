import React from 'react';
import { Button, Tag } from 'rsuite';

import './my-services-card.scss';
import type { MyServiceCardProps } from '@/shared/MyServicesCard/types';

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
  status,
  workerName,
  timeAgo,
  onEdit,
  onDelete,
  onRemove,
  onProfile,
  onMessage,
}) => (
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

      {createdAt && mode === 'my' && <p className="MyServiceCard__created">Создано {createdAt}</p>}

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
            className="MyServiceCard__removeBtn"
            size="sm"
            appearance="subtle"
            onClick={() => onRemove?.(id)}
          >
            Убрать
          </Button>

          <div className="MyServiceCard__actions">
            <Button className="MyServiceCard__profileBtn" size="sm" onClick={() => onProfile?.(id)}>
              Профиль
            </Button>
            <Button className="MyServiceCard__writeBtn" size="sm" onClick={() => onMessage?.(id)}>
              Написать
            </Button>
          </div>
        </>
      ) : (
        <div className="MyServiceCard__right--my">
          {mode === 'my' && status && (
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
