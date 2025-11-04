import './service-catalog.scss';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'rsuite';

import { services } from '@/shared/data/services';
import { FilterGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';

export const ServiceCatalogPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все');

  const filters = [
    { name: 'Стоимость', options: ['По убыванию', 'По возрастанию'] },
    { name: 'Опыт', options: ['Больше 5 лет', '3–5 лет', 'Менее 3 лет'] },
    { name: 'Рейтинг', options: ['4.9 и выше', '4.5 и выше', '4.0 и выше'] },
  ];

  return (
    <div className="ServiceCatalog">
      <div className="ServiceCatalog__header">
        <h2 className="ServiceCatalog__title">Каталог услуг</h2>
        <Button className="ServiceCatalog__add-btn" title="Разместить услугу">
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};
