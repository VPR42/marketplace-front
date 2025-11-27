import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Loader, Pagination } from 'rsuite';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';
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
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [pageSize] = useState(9);
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

  const isLoading = status === 'loading';
  const isEmpty = !isLoading && items.length === 0;
  const selectedService = items.find((s) => s.id === selectedServiceId) || null;

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
              gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
              workerName={
                service.user.master?.pseudonym || `${service.user.name} ${service.user.surname}`
              }
              workerAvatar={service.user.avatarPath}
              onClick={() => {
                setSelectedServiceId(service.id);
                setOpenDetailModal(true);
              }}
            />
          </div>
        ))}
        {isLoading && (
          <div className="ServiceCatalog__loader">
            <Loader size="md" content="" />
          </div>
        )}
        {isEmpty && <div className="ServiceCatalog__empty">Нет подходящих услуг</div>}
      </div>

      {!isLoading && !isEmpty && (
        <div className="ServiceCatalog__pagination">
          <Pagination
            prev
            next
            total={Math.max(1, totalPages) * pageSize}
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

      {selectedService && (
        <ServiceDetailModal
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          service={{
            id: selectedService.id,
            title: selectedService.name,
            description: selectedService.description,
            price: selectedService.price,
            orders: selectedService.ordersCount,
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            workerName:
              selectedService.user.master?.pseudonym ||
              `${selectedService.user.name} ${selectedService.user.surname}`,
            workerRating: '—',
            workerAvatar: selectedService.user.avatarPath,
            category: selectedService.category.name,
            tags: selectedService.tags.map(String),
            experience: selectedService.user.master?.experience
              ? `${selectedService.user.master.experience} лет опыта`
              : undefined,
            location: selectedService.user.city.name,
          }}
          onOrder={() => {}}
          onMessage={() => {}}
          onFavorite={() => {}}
          isFavorite={false}
        />
      )}
    </div>
  );
};
