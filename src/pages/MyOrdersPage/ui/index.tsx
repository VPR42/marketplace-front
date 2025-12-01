/* eslint-disable import/no-duplicates */
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { createChat } from '@/redux-rtk/store/chats/chatsThunks';
import { fetchOrders, updateOrderStatus } from '@/redux-rtk/store/orders/ordersThunks';
import {
  selectOrders,
  selectOrdersLoading,
  selectOrdersPagination,
} from '@/redux-rtk/store/orders/selectors';
import type { OrdersQueryParams } from '@/redux-rtk/store/orders/types';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';

import type { ApiOrderItem, OrderItem, OrderStatus } from '../types';
import { OrderActionModal } from './modals';
import './my-orders.scss';
import { MyOrderCard } from './MyOrderCard';

type StatusFilter = OrderStatus | 'all';

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Созданные', value: 'created' },
  { label: 'В работе', value: 'working' },
  { label: 'Завершённые', value: 'completed' },
  { label: 'Отменённые', value: 'cancelled' },
  { label: 'Не выполненные', value: 'rejected' },
];

const statusLabels: Record<OrderStatus, string> = {
  created: 'Создан',
  working: 'В работе',
  completed: 'Завершён',
  cancelled: 'Отменён',
  rejected: 'Не выполнен',
};

const serverStatus: Record<
  'created' | 'working' | 'completed' | 'cancelled' | 'rejected' | 'other',
  number
> = {
  created: 0,
  working: 1,
  completed: 2,
  cancelled: 3,
  rejected: 4,
  other: 5,
} as const;

const actionToStatus: Record<'start' | 'complete' | 'cancel', number> = {
  start: serverStatus.working,
  complete: serverStatus.completed,
  cancel: serverStatus.cancelled,
};

export const MyOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeStatus, setActiveStatus] = useState<StatusFilter>(() => {
    const saved = localStorage.getItem('myOrdersStatus') as StatusFilter | null;
    if (saved && (saved === 'all' || statusFilters.some((s) => s.value === saved))) {
      return saved;
    }
    return 'all';
  });
  const [activeRole, setActiveRole] = useState<'customer' | 'worker'>(() => {
    const saved = localStorage.getItem('myOrdersRole');
    if (saved === 'customer' || saved === 'worker') {
      return saved;
    }
    return 'customer';
  });

  const [activeFilter, setActiveFilter] = useState('Все');

  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('myOrdersSearch') || '');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{
    type: 'start' | 'complete' | 'cancel' | null;
    order: OrderItem | null;
    role: 'customer' | 'worker';
  }>({ type: null, order: null, role: 'customer' });

  const { categories, status: utilsStatus } = useAppSelector(selectUtilsState);
  const {
    totalCount,
    pageNumber: reduxPageNumber,
    pageSize: reduxPageSize,
  } = useAppSelector(selectOrdersPagination);
  const isLoading = useAppSelector(selectOrdersLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (utilsStatus === 'idle') {
      dispatch(fetchCategories({ jobsCountSort: 'DESC' }));
    }
  }, [dispatch, utilsStatus]);

  const categoryTabs = useMemo(() => {
    if (utilsStatus === 'loading') {
      return ['Все'];
    }
    return ['Все', ...categories.map((c) => c.category.name)];
  }, [categories, utilsStatus]);

  const activeCategoryId = useMemo(() => {
    if (activeFilter === 'Все') {
      return null;
    }
    const found = categories.find((c) => c.category.name === activeFilter);
    return found?.category.id ?? null;
  }, [activeFilter, categories]);

  const [currentPage, setCurrentPage] = useState(reduxPageNumber);

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

  useEffect(() => {
    const params: OrdersQueryParams = {
      pageNumber: currentPage - 1,
      pageSize: reduxPageSize,
      status: activeStatus === 'all' ? undefined : activeStatus,
      categoryId: activeCategoryId ?? undefined,
      search: searchTerm.trim() || undefined,
    };
    dispatch(fetchOrders(params));
  }, [dispatch, currentPage, reduxPageSize, activeStatus, activeCategoryId, searchTerm]);

  const apiOrders = useAppSelector(selectOrders) as ApiOrderItem[] | undefined;

  const filteredOrders = useMemo<OrderItem[]>(() => {
    if (!apiOrders || apiOrders.length === 0) {
      return [];
    }

    return apiOrders.map((o) => ({
      id: String(o.orderId),
      master: o.masterFullName ?? '',
      title: o.jobName ?? '',
      created: o.orderedAt
        ? `${formatDistanceToNow(new Date(o.orderedAt), { locale: ru })} назад`
        : '',
      status: normalizeStatus(o.status),
      gradient: 'linear-gradient(135deg, #5a55fa, #8e8cf1)',
      description: o.jobDescription ?? '',
      categoryId: o.categoryId ?? 0,
      categoryLabel: o.categoryName ?? '',
      budget: o.jobPrice ?? 0,
      location: o.masterCityId ? `Город #${o.masterCityId}` : '',
      image: o.jobCoverUrl ?? undefined,
    }));
  }, [apiOrders]);

  const hasOrders = filteredOrders.length > 0;
  const showEmpty = !isLoading && !hasOrders;

  return (
    <div className="MyOrders">
      <div className="MyOrders__header">
        <h2 className="MyOrders__title">Мои заказы</h2>
        <div className="MyOrders__roles">
          <button
            type="button"
            className={`MyOrders__role ${activeRole === 'customer' ? 'MyOrders__role--active' : ''}`}
            onClick={() => setActiveRole('customer')}
          >
            Я заказчик
          </button>
          <button
            type="button"
            className={`MyOrders__role ${activeRole === 'worker' ? 'MyOrders__role--active' : ''}`}
            onClick={() => setActiveRole('worker')}
          >
            Я исполнитель
          </button>
        </div>
      </div>

      <div className="MyOrders__search">
        <SearchInput
          placeholder="Поиск услуг..."
          defaultValue={searchTerm}
          onSearch={setSearchTerm}
        />
      </div>

      <div className="MyOrders__filters">
        <CategoryTabs categories={categoryTabs} active={activeFilter} onChange={setActiveFilter} />
        <div className="MyOrders__statusTabs">
          {statusFilters.map((s) => (
            <Button
              key={s.value}
              className={`MyOrders__statusTabs__item ${s.value === activeStatus ? 'MyOrders__statusTabs__item--active' : ''}`}
              onClick={() => setActiveStatus(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="MyOrders__list">
        {filteredOrders.length > 0 &&
          filteredOrders.map((order) => (
            <MyOrderCard
              key={order.id}
              {...order}
              role={activeRole}
              onClick={() => {
                setSelectedOrder(order);
                setIsDetailOpen(true);
              }}
              onAction={async (actionType) => {
                if (actionType === 'message') {
                  try {
                    const res = await dispatch(createChat({ orderId: order.id })).unwrap();
                    navigate(`/chats/${res.chatId}`);
                  } catch (e) {
                    console.error('Create chat failed', e);
                  }
                  return;
                } else if (
                  actionType === 'start' ||
                  actionType === 'complete' ||
                  actionType === 'cancel'
                ) {
                  setActionModal({ type: actionType, order, role: activeRole });
                }
              }}
            />
          ))}
      </div>

      {showEmpty && <div className="MyOrders__empty">Заказы не найдены</div>}

      <div className="MyOrders__pagination">
        {isLoading ? (
          <div className="MyOrders__loader">
            <CustomLoader content="" />
          </div>
        ) : (
          !showEmpty && (
            <Pagination
              prev
              next
              total={totalCount}
              limit={reduxPageSize}
              activePage={currentPage}
              onChangePage={setCurrentPage}
            />
          )
        )}
      </div>

      {selectedOrder && (
        <ServiceDetailModal
          mode="orders"
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
          service={{
            id: selectedOrder.id,
            title: selectedOrder.title,
            description: selectedOrder.description,
            price: selectedOrder.budget,
            coverUrl: selectedOrder.image,
            orders: 0,
            gradient: 'linear-gradient(135deg, #ff7a45, #ffb347)',
            workerName: selectedOrder.master,
            workerRating: '5.0',
            workerAvatar: selectedOrder.image || '',
            category: selectedOrder.categoryLabel,
            tags: [
              `Статус: ${statusLabels[selectedOrder.status]}`,
              ``,
              selectedOrder.location,
            ].filter(Boolean),
            location: selectedOrder.location,
          }}
          onOrder={() => setIsDetailOpen(false)}
          onMessage={() => {}}
          onFavorite={() => {}}
        />
      )}

      {actionModal.type && actionModal.order && (
        <OrderActionModal
          open={Boolean(actionModal.type)}
          type={actionModal.type}
          role={actionModal.role}
          onClose={() => setActionModal({ type: null, order: null, role: 'customer' })}
          onConfirm={async () => {
            if (!actionModal.order || !actionModal.type) {
              return;
            }

            const orderId = Number(actionModal.order.id);

            let statusNum: number;

            if (actionModal.type === 'complete' && actionModal.role === 'worker') {
              statusNum = serverStatus.cancelled;
            } else {
              statusNum = actionToStatus[actionModal.type];
            }

            if (!Number.isInteger(orderId) || statusNum === undefined) {
              console.warn('Invalid orderId or status mapping', { orderId, statusNum });
              setActionModal({ type: null, order: null, role: 'customer' });
              return;
            }

            await dispatch(updateOrderStatus({ orderId, status: statusNum }));

            dispatch(
              fetchOrders({
                pageNumber: currentPage - 1,
                pageSize: reduxPageSize,
                status: activeStatus === 'all' ? undefined : activeStatus,
                categoryId: activeCategoryId ?? undefined,
                search: searchTerm.trim() || undefined,
              }),
            );

            setActionModal({ type: null, order: null, role: 'customer' });
          }}
        />
      )}
    </div>
  );
};
