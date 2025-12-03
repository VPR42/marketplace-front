import { useEffect, useMemo, useState } from 'react';
import { Container, Header, Content, Pagination } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { FavoritesList } from '@/pages/FavoritesPage/ui/FavoritesList';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from '@/redux-rtk/store/favorites/favoriteThunks';
import {
  selectFavoritesPagination,
  selectFavoritesStatus,
} from '@/redux-rtk/store/favorites/selectors';
import type { FetchFavoritesParams } from '@/redux-rtk/store/favorites/types';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { FiltersGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import './FavoritesPage.scss';
import { SearchInput } from '@/shared/SearchInput';

const experienceOptions = [
  { label: 'Все', value: null },
  { label: 'До 1 года', value: 0 },
  { label: 'От 1 года', value: 1 },
  { label: 'Более 3 лет', value: 3 },
  { label: 'Более 5 лет', value: 5 },
  { label: 'Более 10 лет', value: 10 },
];

const sortOptions = [
  { label: 'По возрастанию', value: 'ASC' },
  { label: 'По убыванию', value: 'DESC' },
];

export const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status: utilsStatus } = useAppSelector(selectUtilsState);
  const favoritesStatus = useAppSelector(selectFavoritesStatus);

  const {
    totalCount,
    pageNumber: reduxPageNumber,
    pageSize: reduxPageSize,
  } = useAppSelector(selectFavoritesPagination);
  const [currentPage, setCurrentPage] = useState(reduxPageNumber);

  const [activeFilter, setActiveFilter] = useState('Все');

  const [experience, setExperience] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceSort, setPriceSort] = useState<'ASC' | 'DESC' | null>(null);
  const [experienceSort, setExperienceSort] = useState<'ASC' | 'DESC' | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    if (utilsStatus === 'idle') {
      dispatch(fetchCategories({ jobsCountSort: 'DESC' }));
    }
  }, [dispatch, utilsStatus]);

  useEffect(() => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    if (min !== undefined && Number.isNaN(min)) {
      setPriceError('Минимальная цена должна быть числом');
      return;
    }
    if (max !== undefined && Number.isNaN(max)) {
      setPriceError('Максимальная цена должна быть числом');
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError('Минимальная цена не может быть больше максимальной');
      return;
    }
    setPriceError(null);
  }, [minPrice, maxPrice]);

  const categoryTabs = useMemo(() => {
    if (utilsStatus === 'loading') {
      return ['Все'];
    }
    return ['Все', ...categories.map((c) => c.category.name)];
  }, [categories, utilsStatus]);

  const activeCategoryId = useMemo(() => {
    if (activeFilter === 'Все') {
      return null;
    }
    const found = categories.find((c) => c.category.name === activeFilter);
    return found?.category.id ?? null;
  }, [activeFilter, categories]);

  useEffect(() => {
    if (priceError) {
      return;
    }

    const params: FetchFavoritesParams = {
      query: searchQuery || undefined,
      categoryId: activeCategoryId ?? undefined,
      experience: experience ?? undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      priceSort: priceSort ?? undefined,
      experienceSort: experienceSort ?? undefined,
      page: currentPage - 1,
      pageSize: reduxPageSize,
    };

    dispatch(fetchFavorites(params));
  }, [
    dispatch,
    searchQuery,
    activeCategoryId,
    experience,
    minPrice,
    maxPrice,
    priceSort,
    experienceSort,
    priceError,
    currentPage,
    reduxPageSize,
  ]);

  const handleToggle = async (serviceId: string, makeFavorite: boolean) => {
    if (!serviceId) {
      return;
    }
    if (togglingFavoriteId === serviceId) {
      return;
    }

    setTogglingFavoriteId(serviceId);
    try {
      if (makeFavorite) {
        await dispatch(addToFavorites(serviceId)).unwrap();
      } else {
        await dispatch(removeFromFavorites(serviceId)).unwrap();
      }
    } catch (err) {
      console.error('toggle favorite failed', err);
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  return (
    <div className="FavoritesPage">
      <Container>
        <Header className="FavoritesPage__header">
          <h2 className="FavoritesPage__title">Избранное</h2>
        </Header>
        <Content className="FavoritesPage__content">
          <SearchInput
            placeholder="Поиск по избранному..."
            onSearch={setSearchQuery}
            defaultValue=""
          />
          <CategoryTabs
            categories={categoryTabs}
            active={activeFilter}
            onChange={setActiveFilter}
          />
          <FiltersGroup
            experience={experience}
            onExperienceChange={(v) => setExperience(v)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            priceError={priceError ?? undefined}
            priceSort={priceSort}
            experienceSort={experienceSort}
            onPriceSortChange={(v) => setPriceSort(v)}
            onExperienceSortChange={(v) => setExperienceSort(v)}
            experienceOptions={experienceOptions}
            sortOptions={sortOptions as { label: string; value: 'ASC' | 'DESC' }[]}
          />
          <FavoritesList onToggle={handleToggle} />
          <div className="FavoritesPage__pagination">
            {favoritesStatus === 'loading' ? (
              <div className="FavoritePage__loader">
                <CustomLoader content="" />
              </div>
            ) : (
              <Pagination
                prev
                next
                total={totalCount}
                limit={reduxPageSize}
                activePage={currentPage}
                onChangePage={setCurrentPage}
              />
            )}
          </div>
        </Content>
      </Container>
    </div>
  );
};
