import type { OrderItem } from '../types';

const statusToBadge = {
  new: { label: 'Новый', className: 'OrderCard__badge--new' },
  in_progress: { label: 'В работе', className: 'OrderCard__badge--progress' },
  done: { label: 'Выполнен', className: 'OrderCard__badge--done' },
  canceled: { label: 'Отменён', className: 'OrderCard__badge--canceled' },
} as const;

interface MyOrderCardProps extends OrderItem {
  onClick?: () => void;
}

export const MyOrderCard: React.FC<MyOrderCardProps> = ({
  id,
  master,
  title,
  created,
  status,
  description,
  categoryId,
  categoryLabel,
  budget,
  location,
  clientId,
  image,
  onClick,
}) => {
  const badge = statusToBadge[status];

  return (
    <article className="OrderCard" onClick={onClick} role="button">
      <div className="OrderCard__row">
        <div
          className={`OrderCard__thumb ${image ? '' : 'OrderCard__thumb--empty'}`}
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        >
          {!image && 'Фото услуги'}
        </div>

        <div className="OrderCard__body">
          <div className="OrderCard__top">
            <div className="OrderCard__title-group">
              <h4 className="OrderCard__title">{title}</h4>
              <div className="OrderCard__meta">
                <span>{master}</span>
                <span className="OrderCard__dot">•</span>
                <span>{created}</span>
              </div>
            </div>
            {badge && <span className={`OrderCard__badge ${badge.className}`}>{badge.label}</span>}
          </div>

          <p className="OrderCard__description">{description}</p>

          <div className="OrderCard__details">
            <div className="OrderCard__detail">
              <div className="OrderCard__detail-label">Категория</div>
              <div className="OrderCard__detail-value">{categoryLabel}</div>
            </div>
            <div className="OrderCard__detail">
              <div className="OrderCard__detail-label">Бюджет</div>
              <div className="OrderCard__detail-value">{budget.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="OrderCard__detail">
              <div className="OrderCard__detail-label">Локация</div>
              <div className="OrderCard__detail-value">{location}</div>
            </div>
            <div className="OrderCard__detail">
              <div className="OrderCard__detail-label">ID заказа</div>
              <div className="OrderCard__detail-value">#{id}</div>
            </div>
          </div>

          <div className="OrderCard__footer">
            <div className="OrderCard__tags">
              <span className="OrderCard__tag">Client ID: {clientId}</span>
              <span className="OrderCard__tag">Category ID: {categoryId}</span>
            </div>
            <div className="OrderCard__actions">
              <button type="button" className="OrderCard__btn OrderCard__btn--secondary">
                Профиль
              </button>
              <button type="button" className="OrderCard__btn OrderCard__btn--primary">
                Написать
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
