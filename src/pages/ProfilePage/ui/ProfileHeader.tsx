import { Calendar, Edit, MapPin, Share2 } from 'lucide-react';
import { Button, Heading } from 'rsuite';

import { useAppSelector } from '@/redux-rtk/hooks';
import type { User } from '@/redux-rtk/store/auth/types';
import { cities } from '@/shared/data/cities';

import './profile.scss';

interface ProfileHeaderProps {
  user: User | null;
  ordersCount?: number;
  successRate?: number;
  canEdit: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  ordersCount = 0,
  successRate,
  canEdit,
  onEdit,
  onShare,
}) => {
  const fullName = user ? `${user.surname} ${user.name} ${user.patronymic}`.trim() : 'Пользователь';
  const { data: profile } = useAppSelector((state) => state.profile);
  const joinYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;
  const cityLabel = user?.city ? cities.find((c) => c.value === user.city)?.label : null;

  return (
    <div className="ProfileHeader">
      <div className="ProfileHeader__content">
        <div className="ProfileHeader__avatar">
          {user?.avatarPath ? (
            <img src={user.avatarPath} alt={fullName} />
          ) : (
            <div className="ProfileHeader__avatar-placeholder">
              <span>
                {fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="ProfileHeader__info">
          <Heading level={2} className="ProfileHeader__name">
            {fullName}
          </Heading>

          <div className="ProfileHeader__meta">
            {cityLabel && (
              <div className="ProfileHeader__meta-item">
                <MapPin size={16} />
                <span>{cityLabel}</span>
              </div>
            )}
            {joinYear && (
              <div className="ProfileHeader__meta-item">
                <Calendar size={16} />
                <span>На платформе с {joinYear} года</span>
              </div>
            )}
          </div>

          {user && (
            <div className="ProfileHeader__stats">
              <div className="ProfileHeader__stat">
                <span className="ProfileHeader__stat-value">{profile?.orders.ordersCount}</span>
                <span className="ProfileHeader__stat-label">Заказов выполнено</span>
              </div>
              {successRate !== undefined && (
                <div className="ProfileHeader__stat">
                  <span className="ProfileHeader__stat-value">
                    {profile?.orders.completedPercent}%
                  </span>
                  <span className="ProfileHeader__stat-label">Успешных заказов</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ProfileHeader__actions">
          {onShare && (
            <Button appearance="subtle" onClick={onShare} className="ProfileHeader__share-btn">
              <Share2 size={16} />
              <span>Поделиться</span>
            </Button>
          )}
          {canEdit && onEdit && (
            <Button appearance="primary" onClick={onEdit} className="ProfileHeader__edit-btn">
              <Edit size={16} />
              <span>Редактировать</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
