import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Pagination } from 'rsuite';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';
import { ServiceOrderModal } from '@/shared/ServiceModal/ui';

import './service-catalog.scss';

export const ServiceCatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalPages, status } = useAppSelector(selectServicesState);
  const { categories } = useAppSelector(selectUtilsState);

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const shouldOpenCreate = searchParams.get('create') === 'service';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [pageSize] = useState(12);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories({ jobsCountSort: 'DESC', query: null }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchServices({
        page: pageNumber,
        pageSize,
        query: searchTerm || undefined,
        categoryId: categoryId ?? undefined,
      }),
    );
  }, [dispatch, pageNumber, pageSize, searchTerm, categoryId]);

  useEffect(() => {
    if (shouldOpenCreate) {
      setOpenServiceModal(true);
    }
  }, [shouldOpenCreate]);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const categoryTabs = useMemo(
    () => ['Все', ...categories.map((c) => c.category.name)],
    [categories],
  );
  const activeTab = useMemo(() => {
    if (categoryId === null) {
      return 'Все';
    }
    const found = categories.find((c) => c.category.id === categoryId);
    return found?.category.name ?? 'Все';
  }, [categories, categoryId]);

  const handleCategoryChange = (label: string) => {
    if (label === 'Все') {
      setCategoryId(null);
      setPageNumber(0);
      return;
    }
    const found = categories.find((c) => c.category.name === label);
    setCategoryId(found?.category.id ?? null);
    setPageNumber(0);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageNumber(0);
  };

  return (
    <div className="ServiceCatalog">
      <div className="ServiceCatalog__header">
        <h2 className="ServiceCatalog__title">Каталог услуг</h2>
        <Button
          className="ServiceCatalog__add-btn"
          title="Создать услугу"
          onClick={() => setOpenServiceModal(true)}
        >
          <Plus /> Создать услугу
        </Button>
      </div>

      <SearchInput
        placeholder="Ищи услуги по названию или описанию..."
        defaultValue={initialSearch}
        onSearch={handleSearch}
      />

      <CategoryTabs categories={categoryTabs} active={activeTab} onChange={handleCategoryChange} />

      <div className="ServiceCatalog__grid">
        {items.map((service) => (
          <div className="ServiceCatalog__card-wrapper" key={service.id}>
            <ServiceCard
              title={service.name}
              description={service.description}
              price={service.price.toString()}
              orders={service.ordersCount}
              gradient="linear-gradient(135deg, #ff7a18, #af002d 70%)"
              workerName={
                service.user.master?.pseudonym || `${service.user.name} ${service.user.surname}`
              }
              workerRating={'—'}
              workerAvatar={service.user.avatarPath}
              onClick={() => {}}
            />
          </div>
        ))}
        {status === 'loading' && <div className="ServiceCatalog__loading">Загрузка...</div>}
      </div>

      {totalPages > 1 && (
        <div className="ServiceCatalog__pagination">
          <Pagination
            prev
            next
            total={totalPages * pageSize}
            limit={pageSize}
            activePage={pageNumber + 1}
            onChangePage={(p) => setPageNumber(p - 1)}
          />
        </div>
      )}

      {openServiceModal && (
        <ServiceOrderModal
          open={openServiceModal}
          onClose={() => setOpenServiceModal(false)}
          mode="create"
          onSubmit={() => setOpenServiceModal(false)}
        />
      )}
    </div>
  );
};
