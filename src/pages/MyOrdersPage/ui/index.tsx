import { useMemo, useState } from 'react';

import { SearchInput } from '@/shared/SearchInput';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';

import type { OrderItem, OrderStatus } from '../types';
import { MyOrderCard } from './MyOrderCard';
import './my-orders.scss';

type StatusFilter = OrderStatus | 'all';

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Новые', value: 'new' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Выполненные', value: 'done' },
  { label: 'Отмененные', value: 'canceled' },
];

const mockOrders: OrderItem[] = [
  {
    id: 1,
    clientId: 15,
    master: 'Анна Петрова',
    title: 'Репетитор английского для подготовки к IELTS',
    created: '2 часа назад',
    status: 'new',
    description:
      'Помогу подготовиться к экзамену IELTS. Опыт преподавания 8 лет. Сама сдавала экзамен на 8.0. Индивидуальный подход, разбор всех секций экзамена. Гарантирую результат!',
    categoryId: 1,
    categoryLabel: 'Репетиторство',
    budget: 1500,
    location: 'Москва, Тверская',
  },
  {
    id: 2,
    clientId: 23,
    master: 'Клининг Профи',
    title: 'Генеральная уборка квартир и офисов',
    created: '5 часов назад',
    status: 'new',
    description:
      'Профессиональная уборка любой сложности. Используем экологичную химию. Моем окна, убираем после ремонта, чистим мебель. Выезд в день обращения.',
    categoryId: 2,
    categoryLabel: 'Уборка',
    budget: 8000,
    location: 'Москва, весь город',
  },
  {
    id: 3,
    clientId: 8,
    master: 'Сергей Иванов',
    title: 'Сантехнические работы любой сложности',
    created: '1 день назад',
    status: 'in_progress',
    description:
      'Прочистка канализации, установка сантехники, замена труб, устранение протечек. Работаю быстро и качественно. Гарантия 1 год.',
    categoryId: 3,
    categoryLabel: 'Сантехника',
    budget: 3500,
    location: 'Москва, СВАО',
  },
  {
    id: 4,
    clientId: 42,
    master: 'Дмитрий Козлов',
    title: 'Репетитор по математике и физике',
    created: '2 дня назад',
    status: 'done',
    description: 'Подготовка к ОГЭ и ЕГЭ. Кандидат физ.-мат. наук. Все ученики сдают на 80+.',
    categoryId: 1,
    categoryLabel: 'Репетиторство',
    budget: 1200,
    location: 'Москва, ЦАО',
  },
  {
    id: 5,
    clientId: 19,
    master: 'Мастер на час',
    title: 'Мелкий бытовой ремонт',
    created: '3 дня назад',
    status: 'canceled',
    description:
      'Повешу полки, соберу мебель, заменю розетки, установлю карниз и люстру. Свой инструмент.',
    categoryId: 4,
    categoryLabel: 'Ремонт',
    budget: 2000,
    location: 'Москва, ЗАО',
  },
];

export const MyOrdersPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return mockOrders.filter((order) => {
      const statusOk = activeStatus === 'all' ? true : order.status === activeStatus;
      const matchesSearch =
        normalized.length === 0 ||
        order.title.toLowerCase().includes(normalized) ||
        order.description.toLowerCase().includes(normalized) ||
        order.master.toLowerCase().includes(normalized);

      return statusOk && matchesSearch;
    });
  }, [activeStatus, searchTerm]);

  return (
    <div className="MyOrders">
      <div className="MyOrders__header">
        <h2 className="MyOrders__title">Мои заказы</h2>
      </div>

      <div className="MyOrders__search">
        <SearchInput placeholder="Поиск услуг..." onSearch={(value) => setSearchTerm(value)} />
      </div>

      <div className="MyOrders__filters">
        {statusFilters.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={`MyOrders__filter-btn ${
              activeStatus === value ? 'MyOrders__filter-btn--active' : ''
            }`}
            onClick={() => setActiveStatus(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="MyOrders__list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <MyOrderCard
              key={order.id}
              {...order}
              onClick={() => {
                setSelectedOrder(order);
                setIsDetailOpen(true);
              }}
            />
          ))
        ) : (
          <div className="MyOrders__empty">Заказы не найдены</div>
        )}
      </div>

      {selectedOrder && (
        <ServiceDetailModal
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
          service={{
            id: selectedOrder.id,
            title: selectedOrder.title,
            description: selectedOrder.description,
            price: selectedOrder.budget.toString(),
            orders: 0,
            gradient: 'linear-gradient(135deg, #ff7a45, #ffb347)',
            workerName: selectedOrder.master,
            workerRating: '5.0',
            workerAvatar: selectedOrder.image || '',
            category: selectedOrder.categoryLabel,
            tags: [
              `Статус: ${selectedOrder.status}`,
              `Клиент #${selectedOrder.clientId}`,
              selectedOrder.location,
            ].filter(Boolean),
            location: selectedOrder.location,
          }}
          onOrder={() => setIsDetailOpen(false)}
          onMessage={() => {}}
          onFavorite={() => {}}
        />
      )}
    </div>
  );
};
