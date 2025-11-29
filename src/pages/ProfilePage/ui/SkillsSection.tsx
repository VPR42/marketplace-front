import { Edit } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import './profile.scss';

interface SkillsSectionProps {
  skills?: string[];
  canEdit: boolean;
  onEdit?: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, canEdit, onEdit }) => {
  const hasSkills = skills && skills.length > 0;

  return (
    <div className="SkillsSection">
      <div className="SkillsSection__header">
        <Heading level={3} className="SkillsSection__title">
          Навыки и специализация
        </Heading>
        {canEdit && onEdit && (
          <Button
            appearance="subtle"
            size="sm"
            onClick={onEdit}
            className="SkillsSection__edit-btn"
          >
            <Edit size={14} />
          </Button>
        )}
      </div>

      <div className="SkillsSection__content">
        {hasSkills ? (
          <div className="SkillsSection__tags">
            {skills.map((skill, index) => (
              <span key={index} className="SkillsSection__tag">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="SkillsSection__placeholder">
            <p className="SkillsSection__placeholder-text">
              Мастер ещё не указал свои навыки и специализацию.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
