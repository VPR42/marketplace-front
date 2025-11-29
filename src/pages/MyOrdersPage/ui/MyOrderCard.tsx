import type { OrderItem } from '../types';

const statusToBadge = {
  created: { label: 'Создан', className: 'OrderCard__badge--created' },
  working: { label: 'В работе', className: 'OrderCard__badge--working' },
  completed: { label: 'Завершён', className: 'OrderCard__badge--completed' },
  cancelled: { label: 'Отменён', className: 'OrderCard__badge--cancelled' },
  rejected: { label: 'Не выполнен', className: 'OrderCard__badge--rejected' },
} as const;

interface MyOrderCardProps extends OrderItem {
  onClick?: () => void;
  role?: 'customer' | 'worker';
  onAction?: (action: 'start' | 'complete' | 'cancel' | 'message' | 'profile') => void;
}

export const MyOrderCard: React.FC<MyOrderCardProps> = ({
  master,
  title,
  created,
  status,
  description,
  categoryLabel,
  budget,
  location,
  image,
  onClick,
  role = 'customer',
  onAction,
}) => {
  const badge = statusToBadge[status];

  const actions =
    role === 'worker'
      ? status === 'created'
        ? [
            { label: 'Начать выполнение', variant: 'primary' as const, action: 'start' as const },
            { label: 'Написать', variant: 'secondary' as const, action: 'message' as const },
            { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
          ]
        : status === 'working'
          ? [
              {
                label: 'Завершить принудительно',
                variant: 'danger' as const,
                action: 'complete' as const,
              },
              { label: 'Написать', variant: 'secondary' as const, action: 'message' as const },
              { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
            ]
          : [
              { label: 'Написать', variant: 'primary' as const, action: 'message' as const },
              { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
            ]
      : status === 'created'
        ? [
            { label: 'Отменить заказ', variant: 'danger' as const, action: 'cancel' as const },
            { label: 'Написать', variant: 'secondary' as const, action: 'message' as const },
            { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
          ]
        : status === 'working'
          ? [
              {
                label: 'Завершить заказ',
                variant: 'success' as const,
                action: 'complete' as const,
              },
              { label: 'Написать', variant: 'secondary' as const, action: 'message' as const },
              { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
            ]
          : [
              { label: 'Написать', variant: 'primary' as const, action: 'message' as const },
              { label: 'Профиль', variant: 'secondary' as const, action: 'profile' as const },
            ];

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <article className="OrderCard" onClick={handleCardClick} role="button">
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
              <div className="OrderCard__detail-label">Цена</div>
              <div className="OrderCard__detail-value">{budget.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="OrderCard__detail">
              <div className="OrderCard__detail-label">Локация</div>
              <div className="OrderCard__detail-value">{location}</div>
            </div>
            <div className="OrderCard__detail" />
          </div>

          <div className="OrderCard__footer">
            <div className="OrderCard__tags" />
            <div className="OrderCard__actions">
              {actions.map(({ label, variant, action }) => (
                <button
                  type="button"
                  key={label}
                  className={`OrderCard__btn OrderCard__btn--${variant}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.(action);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
