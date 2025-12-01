import { Heading } from 'rsuite';

import './profile.scss';

interface Order {
  id: number;
  title: string;
  price: number;
  date: string;
  status: 'completed' | 'cancelled' | 'in_progress';
}

interface RecentOrdersSectionProps {
  orders?: Order[];
}

export const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = ({ orders }) => {
  const hasOrders = orders && orders.length > 0;

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Завершён';
      case 'cancelled':
        return 'Отменён';
      case 'in_progress':
        return 'В работе';
      default:
        return status;
    }
  };

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'RecentOrdersSection__status--completed';
      case 'cancelled':
        return 'RecentOrdersSection__status--cancelled';
      case 'in_progress':
        return 'RecentOrdersSection__status--in-progress';
      default:
        return '';
    }
  };

  return (
    <div className="RecentOrdersSection">
      <div className="RecentOrdersSection__header">
        <Heading level={3} className="RecentOrdersSection__title">
          Недавние заказы
        </Heading>
      </div>

      <div className="RecentOrdersSection__content">
        {hasOrders ? (
          <div className="RecentOrdersSection__list">
            {orders.map((order) => (
              <div key={order.id} className="RecentOrdersSection__item">
                <div className="RecentOrdersSection__item-header">
                  <span className="RecentOrdersSection__item-title">{order.title}</span>
                  <span className="RecentOrdersSection__item-price">{order.price} ₽</span>
                </div>
                <div className="RecentOrdersSection__item-footer">
                  <span className="RecentOrdersSection__item-date">{order.date}</span>
                  <span className={`RecentOrdersSection__status ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="RecentOrdersSection__placeholder">
            <p className="RecentOrdersSection__placeholder-text">
              Пока нет недавних заказов. После появления новых заказов они будут показаны здесь.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
