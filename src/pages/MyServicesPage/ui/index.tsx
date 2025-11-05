import React, { useState } from 'react';
import { Button } from 'rsuite';

import './my-services.scss';
import { MyServiceCard } from '@/pages/MyServicesPage/ui/MyServiceCard';
import { myServices } from '@/shared/data/myServices';
import { CategoryTabs } from '@/shared/FilterTabs';

import { Plus } from 'lucide-react';

export const MyServicesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все категории');

  return (
    <div className="MyServices">
      <h2 className="MyServices__title">Мои услуги</h2>

      <div className="MyServices__topBar">
        <CategoryTabs
          categories={[
            'Все категории',
            'Репетиторство',
            'Уборка',
            'Сантехника',
            'Ремонт',
            'Электрика',
          ]}
          active={activeFilter}
          onChange={setActiveFilter}
        />
        <Button className="MyServices__createBtn" title="Разместить услугу">
          <Plus /> Создать услугу
        </Button>
      </div>

      <div className="MyServices__list">
        {myServices.map((service) => (
          <MyServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
};
