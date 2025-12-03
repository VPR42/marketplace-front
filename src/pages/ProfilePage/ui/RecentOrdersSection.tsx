import { Button, Heading } from 'rsuite';

import './profile.scss';
import type { ApiOrderItem, OrderStatus } from '@/pages/MyOrdersPage/types';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';

import { useEffect, useState } from 'react';

import { fetchOrders } from '@/redux-rtk/store/orders/ordersThunks';
import { selectOrders } from '@/redux-rtk/store/orders/selectors';
import type { OrdersQueryParams } from '@/redux-rtk/store/orders/types';

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

export const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = () => {
  const dispatch = useAppDispatch();
  const [isMasterOrder, setIsMasterOrder] = useState<boolean>();

  const normalizeStatus = (s?: string): OrderStatus => {
    if (!s) {
      return 'created';
    }
    const v = s.toLowerCase();
    if (v.includes('work') || v.includes('in_progress') || v.includes('progress')) {
      return 'working';
    }
    if (v.includes('complete') || v.includes('done') || v.includes('finished')) {
      return 'completed';
    }
    if (v.includes('cancel')) {
      return 'cancelled';
    }
    if (v.includes('reject') || v.includes('failed')) {
      return 'rejected';
    }
    return v as unknown as OrderStatus;
  };

  const orders = useAppSelector(selectOrders) as ApiOrderItem[] | undefined;

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

  useEffect(() => {
    const params: OrdersQueryParams = {
      pageNumber: 0,
      pageSize: 5,
      status: null,
      isMasterOrder,
    };
    dispatch(fetchOrders(params));
  }, [dispatch, isMasterOrder]);

  return (
    <div className="RecentOrdersSection">
      <div className="RecentOrdersSection__header">
        <Heading level={3} className="RecentOrdersSection__title">
          Недавние заказы
        </Heading>
      </div>
      <Button className="RecentOrders__button" onClick={() => setIsMasterOrder(true)}>
        Выполненные
      </Button>
      <Button className="RecentOrders__button" onClick={() => setIsMasterOrder(false)}>
        Заказанные
      </Button>
      <div className="RecentOrdersSection__content">
        {hasOrders ? (
          <div className="RecentOrdersSection__list">
            {orders.map((order) => {
              const uiStatus = normalizeStatus(order.status);

              return (
                <div key={order.orderId} className="RecentOrdersSection__item">
                  <div className="RecentOrdersSection__item-header">
                    <span className="RecentOrdersSection__item-title">{order.jobName}</span>
                    <span className="RecentOrdersSection__item-price">{order.jobPrice} ₽</span>
                  </div>

                  <div className="RecentOrdersSection__item-footer">
                    <span className="RecentOrdersSection__item-date">{order.orderedAt ?? ''}</span>

                    <span
                      className={`RecentOrdersSection__status ${getStatusClass(
                        uiStatus as 'completed' | 'cancelled' | 'in_progress',
                      )}`}
                    >
                      {getStatusText(uiStatus as 'completed' | 'cancelled' | 'in_progress')}
                    </span>
                  </div>
                </div>
              );
            })}
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
