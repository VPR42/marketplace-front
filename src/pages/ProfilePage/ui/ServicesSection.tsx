import { Plus } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import { ServiceCard } from '@/shared/ServiceCard/ui';

import './profile.scss';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  orders?: number;
  gradient?: string;
  workerName?: string;
  workerRating?: string;
  workerAvatar?: string;
  coverUrl?: string;
}

interface ServicesSectionProps {
  services?: Service[];
  canEdit: boolean;
  onAddService?: () => void;
  onServiceClick?: (serviceId: string) => void;
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
          Мои услуги
        </Heading>
        {canEdit && onAddService && (
          <Button
            appearance="primary"
            onClick={onAddService}
            className="ServicesSection__add-btn orange-btn"
          >
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
                  price={String(service.price)}
                  orders={service.orders || 0}
                  gradient={service.gradient || 'linear-gradient(135deg, #6e45e2, #88d3ce)'}
                  coverUrl={service.coverUrl || service.gradient}
                  workerName={service.workerName || ''}
                  workerAvatar={service.workerAvatar || ''}
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
                Добавьте услуги, чтобы клиенты могли видеть и заказывать ваши работы.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
