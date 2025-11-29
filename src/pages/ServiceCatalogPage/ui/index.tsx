import './service-catalog.scss';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'rsuite';

import { OrderCreateModal } from '@/components/OrderCreateModal';
import { PaymentModal, PaymentResultModal } from '@/pages/MyOrdersPage/ui/modals';
import { services } from '@/shared/data/services';
import { FilterGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';
import { ServiceOrderModal } from '@/shared/ServiceModal/ui';

export const ServiceCatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get('search') ?? '';
  const shouldOpenCreate = searchParams.get('create') === 'service';

  const [activeFilter, setActiveFilter] = useState('Все');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFormKey, setOrderFormKey] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    open: boolean;
    status: 'success' | 'error';
    methodMask: string;
  }>({
    open: false,
    status: 'success',
    methodMask: '',
  });

  const filters = [
    { name: 'Стоимость', options: ['По убыванию', 'По возрастанию'] },
    { name: 'Опыт', options: ['Больше 5 лет', '3–5 лет', 'Менее 3 лет'] },
    { name: 'Рейтинг', options: ['4.9 и выше', '4.5 и выше', '4.0 и выше'] },
  ];

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return services;
    }
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.workerName.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  useEffect(() => {
    if (shouldOpenCreate) {
      setOpenServiceModal(true);
    }
  }, [shouldOpenCreate]);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  return (
    <div className="ServiceCatalog">
      <div className="ServiceCatalog__header">
        <h2 className="ServiceCatalog__title">Каталог услуг</h2>
        <Button
          className="ServiceCatalog__add-btn"
          title="Разместить услугу"
          onClick={() => setOpenServiceModal(true)}
        >
          <Plus /> Разместить услугу
        </Button>
      </div>

      <SearchInput
        placeholder="Поиск услуг и мастеров..."
        defaultValue={initialSearch}
        onSearch={(value) => setSearchTerm(value)}
      />

      <CategoryTabs
        categories={['Все', 'Ремонт', 'Уборка', 'Сантехника', 'IT услуги', 'Электрика']}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <FilterGroup filters={filters} />

      <div className="ServiceCatalog__grid">
        {filteredServices.map((service) => (
          <div className="ServiceCatalog__card-wrapper" key={service.id}>
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              orders={service.orders}
              gradient={service.gradient}
              workerAvatar={service.workerAvatar}
              workerName={service.workerName}
              workerRating={service.workerRating}
              onClick={() => {
                setSelectedService(service);
                setOrderFormKey((k) => k + 1);
                setIsDetailModalOpen(true);
              }}
            />
          </div>
        ))}
      </div>
      {openServiceModal && (
        /*крч вот тут я для тестов оставил чтобы открыть модалку создания услуги сделайте mode = "create" и удалите onDelete
          а для вызова модалки редактирования укажите mode = "edit" и прокиньте onDelete чтобы кнопка удаления услуги срабатывала как нада.
          onSubmit ето действие, что будет происходить при нажатии на голубую кнопку (в разных режимах она будет называться по разному)*/
        <ServiceOrderModal
          open={openServiceModal}
          onClose={() => setOpenServiceModal(false)}
          mode="create"
          onSubmit={() => {}}
        />
      )}

      {selectedService && (
        <ServiceDetailModal
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedService(null);
          }}
          service={{
            id: selectedService.id,
            title: selectedService.title,
            description: selectedService.description,
            price: selectedService.price,
            orders: selectedService.orders,
            gradient: selectedService.gradient,
            workerName: selectedService.workerName,
            workerRating: selectedService.workerRating,
            workerAvatar: selectedService.workerAvatar,
            category: 'Сантехника', // можно будет получать из данных
            tags: ['Гарантия 6 месяцев', 'Чек и договор', 'Безнал/Наличные', 'Выезд сегодня'],
            experience: '7 лет опыта',
            location: 'Москва, СВО',
          }}
          onOrder={() => {
            setIsDetailModalOpen(false);
            setIsOrderModalOpen(true);
          }}
          onMessage={() => {
            console.log('Написать мастеру');
          }}
          onFavorite={() => {
            console.log('Добавить в избранное');
          }}
        />
      )}

      {selectedService && (
        <OrderCreateModal
          key={orderFormKey}
          open={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setIsDetailModalOpen(false);
            setSelectedService(null);
            setOrderFormKey((k) => k + 1);
          }}
          onBack={() => {
            setIsOrderModalOpen(false);
            if (selectedService) {
              setIsDetailModalOpen(true);
            }
          }}
          onSubmit={(data) => {
            console.log('Данные заказа:', data);
            setIsOrderModalOpen(false);
            setOrderFormKey((k) => k + 1);
            setIsPaymentModalOpen(true);
          }}
          service={{
            title: selectedService.title,
            workerName: selectedService.workerName,
            price: Number(selectedService.price),
            location: 'Москва, СВО',
            gradient: selectedService.gradient,
            tags: ['Гарантия 6 месяцев', 'Чек и договор', 'Выезд сегодня'],
          }}
        />
      )}

      {selectedService && (
        <PaymentModal
          open={isPaymentModalOpen}
          title="Оплата услуги"
          serviceTitle={selectedService.title}
          price={Number(selectedService.price)}
          fee={0}
          methods={[
            { id: 'card1', brand: 'Mastercard', masked: '•••• 1234', expire: '08/27' },
            { id: 'card2', brand: 'Visa', masked: '•••• 9876', expire: '01/29' },
          ]}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={(methodId) => {
            const methodMask = methodId === 'card2' ? '•••• 9876' : '•••• 1234';
            setIsPaymentModalOpen(false);
            setPaymentResult({ open: true, status: 'success', methodMask });
          }}
        />
      )}

      {selectedService && (
        <PaymentResultModal
          open={paymentResult.open}
          status={paymentResult.status}
          orderId={selectedService.id}
          amount={Number(selectedService.price)}
          cardMask={paymentResult.methodMask || '•••• 1234'}
          datetime={new Date().toLocaleString('ru-RU')}
          onClose={() => setPaymentResult((prev) => ({ ...prev, open: false }))}
          onPrimary={() => setPaymentResult((prev) => ({ ...prev, open: false }))}
          onSecondary={() => {
            setPaymentResult((prev) => ({ ...prev, open: false }));
            setIsDetailModalOpen(false);
            setSelectedService(null);
            navigate('/my-orders');
          }}
        />
      )}
    </div>
  );
};
