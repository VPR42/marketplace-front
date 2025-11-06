import React, { useState } from 'react';
import { Button } from 'rsuite';

import './my-services.scss';
import { MyServiceCard } from '@/pages/MyServicesPage/ui/MyServiceCard';
import { myServices } from '@/shared/data/myServices';
import { CategoryTabs } from '@/shared/FilterTabs';
import { ServiceOrderModal } from '@/shared/ServiceModal/ui';

import { Plus } from 'lucide-react';

export const MyServicesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все категории');
  const [openServiceModal, setOpenServiceModal] = useState(false);

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
          <MyServiceCard
            key={service.id}
            {...service}
            onEdit={() => {
              setOpenServiceModal(true);
            }}
          />
        ))}
      </div>

      {openServiceModal && (
        <ServiceOrderModal
          open={openServiceModal}
          onClose={() => setOpenServiceModal(false)}
          mode="edit"
          onSubmit={() => setOpenServiceModal(false)}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};
