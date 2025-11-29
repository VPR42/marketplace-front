import { useEffect, useMemo, useState } from 'react';
import { Container, Header, Content } from 'rsuite';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { CategoryTabs } from '@/shared/FilterTabs';

import { FavoritesList } from './FavoritesList';
import './FavoritesPage.scss';

export const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status } = useAppSelector(selectUtilsState);
  const [activeFilter, setActiveFilter] = useState('Все');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories({ jobsCountSort: 'DESC' }));
    }
  }, [dispatch, status]);

  const categoryTabs = useMemo(() => {
    if (status === 'loading') {
      return ['Все'];
    }
    return ['Все', ...categories.map((c) => c.category.name)];
  }, [categories, status]);

  return (
    <div className="FavoritesPage">
      <Container>
        <Header className="FavoritesPage__header">
          <h2 className="FavoritesPage__title">Избранное</h2>
        </Header>
        <Content className="FavoritesPage__content">
          <CategoryTabs
            categories={categoryTabs}
            active={activeFilter}
            onChange={setActiveFilter}
          />
          <FavoritesList filterCategory={activeFilter} />
        </Content>
      </Container>
    </div>
  );
};
