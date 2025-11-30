import { Clock, Edit, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
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

const formatPhone = (value?: string) => {
  if (!value) {
    return 'Телефон не указан';
  }
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (!clean) {
    return 'Телефон не указан';
  }
  const parts = [
    clean.slice(0, 1),
    clean.slice(1, 4),
    clean.slice(4, 7),
    clean.slice(7, 9),
    clean.slice(9, 11),
  ];
  const country = parts[0] ? `+${parts[0]}` : '';
  const city = parts[1] ? ` (${parts[1]}${parts[1].length === 3 ? ')' : ''}` : '';
  const first = parts[2] ? ` ${parts[2]}` : '';
  const second = parts[3] ? `-${parts[3]}` : '';
  const third = parts[4] ? `-${parts[4]}` : '';
  return `${country}${city}${first}${second}${third}`.trim() || 'Телефон не указан';
};

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
            <Edit size={14} />
            <span>Редактировать</span>
          </Button>
        )}
      </div>

      <div className="ContactSection__content">
        <div className="ContactSection__item">
          <Phone size={18} className="ContactSection__icon" />
          <span className="ContactSection__text">{formatPhone(phone)}</span>
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
