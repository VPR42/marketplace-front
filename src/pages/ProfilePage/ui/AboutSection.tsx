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
              Добавьте информацию о себе: что вы делаете, в чем специализируетесь, какой опыт и что
              важно знать клиенту.
            </p>
            <p className="AboutSection__placeholder-text">
              Подробное описание повышает доверие и помогает быстрее находить подходящие заказы.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
