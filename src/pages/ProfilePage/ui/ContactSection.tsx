import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import { cities } from '@/shared/data/cities';

import './profile.scss';

interface ContactSectionProps {
  phone?: string;
  email?: string;
  cityId?: number;
  workingHours?: string;
  canEdit: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  phone,
  email,
  cityId,
  workingHours,
  canEdit,
  onEdit,
  onMessage,
}) => {
  const cityName = cityId ? cities.find((c) => c.value === cityId)?.label : null;

  return (
    <div className="ContactSection">
      <div className="ContactSection__header">
        <Heading level={3} className="ContactSection__title">
          Контактная информация
        </Heading>
        {canEdit && onEdit && (
          <Button
            appearance="subtle"
            size="sm"
            onClick={onEdit}
            className="ContactSection__edit-btn"
          >
            <span>Редактировать</span>
          </Button>
        )}
      </div>

      <div className="ContactSection__content">
        <div className="ContactSection__item">
          <Phone size={18} className="ContactSection__icon" />
          <span className="ContactSection__text">{phone || 'Телефон пока не указан'}</span>
        </div>

        <div className="ContactSection__item">
          <Mail size={18} className="ContactSection__icon" />
          <span className="ContactSection__text">{email || 'Email не указан'}</span>
        </div>

        {cityName && (
          <div className="ContactSection__item">
            <MapPin size={18} className="ContactSection__icon" />
            <span className="ContactSection__text">{cityName}</span>
          </div>
        )}

        {workingHours && (
          <div className="ContactSection__item">
            <Clock size={18} className="ContactSection__icon" />
            <span className="ContactSection__text">{workingHours}</span>
          </div>
        )}

        {!canEdit && onMessage && (
          <Button appearance="primary" onClick={onMessage} className="ContactSection__message-btn">
            <MessageCircle size={16} />
            <span>Написать сообщение</span>
          </Button>
        )}
      </div>
    </div>
  );
};
