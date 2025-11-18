import './service-catalog.scss';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'rsuite';

import { services } from '@/shared/data/services';
import { FilterGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import { OrderPlacementModal } from '@/shared/OrderPlacementModal';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';
import { ServiceOrderModal } from '@/shared/ServiceModal/ui';

export const ServiceCatalogPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все');
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const filters = [
    { name: 'Стоимость', options: ['По убыванию', 'По возрастанию'] },
    { name: 'Опыт', options: ['Больше 5 лет', '3–5 лет', 'Менее 3 лет'] },
    { name: 'Рейтинг', options: ['4.9 и выше', '4.5 и выше', '4.0 и выше'] },
  ];

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
        onSearch={(value) => console.log('Ищем типа:', value)}
      />

      <CategoryTabs
        categories={['Все', 'Ремонт', 'Уборка', 'Сантехника', 'IT услуги', 'Электрика']}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <FilterGroup filters={filters} />

      <div className="ServiceCatalog__grid">
        {services.map((service) => (
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
        <OrderPlacementModal
          open={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            // Возвращаемся к модальному окну с деталями услуги
            if (selectedService) {
              setIsDetailModalOpen(true);
            }
          }}
          service={{
            id: selectedService.id,
            title: selectedService.title,
            workerName: selectedService.workerName,
            category: 'Сантехника',
            tags: ['Гарантия 6 месяцев', 'Чек и договор'],
            price: selectedService.price,
          }}
          onSubmit={(data) => {
            console.log('Данные заказа:', data);
          }}
        />
      )}
    </div>
  );
};
