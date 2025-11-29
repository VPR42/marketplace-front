import { Edit } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import './profile.scss';

interface AboutSectionProps {
  text?: string;
  canEdit: boolean;
  onEdit?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ text, canEdit, onEdit }) => {
  const hasText = text && text.trim().length > 0;

  return (
    <div className="AboutSection">
      <div className="AboutSection__header">
        <Heading level={3} className="AboutSection__title">
          Обо мне
        </Heading>
        {canEdit && onEdit && (
          <Button appearance="subtle" size="sm" onClick={onEdit} className="AboutSection__edit-btn">
            <Edit size={14} />
          </Button>
        )}
      </div>

      <div className="AboutSection__content">
        {hasText ? (
          <p className="AboutSection__text">{text}</p>
        ) : (
          <div className="AboutSection__placeholder">
            <p className="AboutSection__placeholder-text">
              Здесь мастер может рассказать о себе: опыте работы, специализации, важных деталях и
              подходе к клиентам.
            </p>
            <p className="AboutSection__placeholder-text">
              После заполнения профиля и добавления услуг, клиенты увидят подробную информацию о
              том, чем вы занимаетесь, и смогут оформлять заказы напрямую через платформу.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
