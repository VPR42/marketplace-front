import './service-catalog.scss';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { services } from '@/shared/data/services';
import { FilterGroup } from '@/shared/FilterGroup';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ServiceCard';

export const ServiceCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Все');

  const filters = [
    { name: 'Стоимость', options: ['По убыванию', 'По возрастанию'] },
    { name: 'Опыт', options: ['Больше 5 лет', '3–5 лет', 'Менее 3 лет'] },
    { name: 'Рейтинг', options: ['4.9 и выше', '4.5 и выше', '4.0 и выше'] },
  ];

  return (
    <div className="ServiceCatalog">
      <div className="ServiceCatalog__header">
        <h1 className="ServiceCatalog__title">Каталог услуг</h1>
        <button className="ServiceCatalog__add-btn" title="Разместить услугу">
          <Plus /> Разместить услугу
        </button>
      </div>

      <SearchInput
        placeholder="Поиск услуг и мастеров..."
        onSearch={(value) => console.log('Ищем типа:', value)}
      />

      <div className="ServiceCatalog__categories">
        {['Все', 'Ремонт', 'Уборка', 'Сантехника', 'IT услуги', 'Электрика'].map((category) => (
          <button
            key={category}
            className={`ServiceCatalog__category ${
              category === activeCategory ? 'ServiceCatalog__category--active' : ''
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

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
