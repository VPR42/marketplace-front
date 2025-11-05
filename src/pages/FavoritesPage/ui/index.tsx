import { Container, Header, Content } from 'rsuite';

import { FavoritesList } from './FavoritesList';

import './FavoritesPage.scss';
import { useState } from 'react';

import { CategoryTabs } from '@/shared/FilterTabs';

export const FavoritesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все');

  return (
    <div className="FavoritesPage">
      <Container>
        <Header className="FavoritesPage__header">
          <h2 className="FavoritesPage__title">Избранное</h2>
        </Header>
        <Content className="FavoritesPage__content">
          <CategoryTabs
            categories={['Все', 'Услуги', 'Мастера']}
            active={activeFilter}
            onChange={setActiveFilter}
          />
          <FavoritesList />
        </Content>
      </Container>
    </div>
  );
};
