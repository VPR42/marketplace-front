import './service-card.scss';
import type { ServiceCardProps } from '@/shared/ServiceCard/types';

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  orders,
  gradient,
  workerName = 'Алексей С.',
  workerRating = '4.9',
  workerAvatar = 'https://sun9-38.userapi.com/s/v1/ig2/O_n9fwqhc6ctMwJNzSoUqrtJf3Ux8g3blHJzygBp4VW6cmcHgPQ9mdBnjBUWjLTrXkt3v-SVjdFjWDdx5-4WuECr.jpg?quality=95&as=32x48,48x72,72x108,108x162,160x240,240x360,360x540,480x720,540x810,640x960,720x1080,1080x1620,1280x1920,1440x2160,1707x2560&from=bu&cs=1280x0',
  onClick,
}) => (
  <div className="ServiceCard" onClick={onClick}>
    <div className="ServiceCard__top" style={{ background: gradient }}>
      <span className="ServiceCard__top-text">{title}</span>
    </div>
    <div className="ServiceCard__body">
      <div className="ServiceCard__content">
        <h3 className="ServiceCard__title">{title}</h3>

        {/* Блок исполнителя */}
        <div className="ServiceCard__worker">
          <img className="ServiceCard__worker-img" src={workerAvatar} alt={workerName} />
          <span className="ServiceCard__worker-name">{workerName}</span>
          <span className="ServiceCard__worker-rating">
            <span className="ServiceCard__star">★</span>
            <span>{workerRating}</span>
          </span>
        </div>

        <p className="ServiceCard__description">{description}</p>
      </div>
      {/* Футер с ценой и заказами */}
      <div className="ServiceCard__footer">
        <span className="ServiceCard__price">от {price}₽</span>
        <span className="ServiceCard__orders">{orders} заказов</span>
      </div>
    </div>
  </div>
);
