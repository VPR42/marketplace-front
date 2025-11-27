import { Plus } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import { ServiceCard } from '@/shared/ServiceCard/ui';

import './profile.scss';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string | number;
  orders?: number;
  gradient?: string;
  workerName?: string;
  workerRating?: string;
  workerAvatar?: string;
}

interface ServicesSectionProps {
  services?: Service[];
  canEdit: boolean;
  onAddService?: () => void;
  onServiceClick?: (serviceId: number) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  canEdit,
  onAddService,
  onServiceClick,
}) => {
  const hasServices = services && services.length > 0;

  return (
    <div className="ServicesSection">
      <div className="ServicesSection__header">
        <Heading level={3} className="ServicesSection__title">
          Предоставляемые услуги
        </Heading>
        {canEdit && onAddService && (
          <Button appearance="primary" onClick={onAddService} className="ServicesSection__add-btn">
            <Plus size={16} />
            <span>Добавить услугу</span>
          </Button>
        )}
      </div>

      <div className="ServicesSection__content">
        {hasServices ? (
          <div className="ServicesSection__grid">
            {services.map((service) => (
              <div key={service.id} className="ServicesSection__card-wrapper">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  price={typeof service.price === 'number' ? String(service.price) : service.price}
                  orders={service.orders || 0}
                  gradient={service.gradient || 'linear-gradient(135deg, #6e45e2, #88d3ce)'}
                  workerName={service.workerName}
                  workerRating={service.workerRating}
                  workerAvatar={service.workerAvatar}
                  onClick={() => onServiceClick?.(service.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="ServicesSection__placeholder">
            <div className="ServicesSection__placeholder-icon">
              <Plus size={24} />
            </div>
            <p className="ServicesSection__placeholder-text">Услуги пока не добавлены</p>
            {canEdit && (
              <p className="ServicesSection__placeholder-hint">
                После того как мастер укажет свои услуги и примерную стоимость, они появятся в этом
                блоке и будут видны клиентам на странице профиля.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
