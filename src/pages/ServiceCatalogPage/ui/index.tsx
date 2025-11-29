import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Input, Loader, Pagination, SelectPicker } from 'rsuite';

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

  const [experience, setExperience] = useState<number | null>(null);

  const [minPrice, setMinPrice] = useState('');

  const [maxPrice, setMaxPrice] = useState('');

  const [priceSort, setPriceSort] = useState<'ASC' | 'DESC' | null>(null);

  const [experienceSort, setExperienceSort] = useState<'ASC' | 'DESC' | null>(null);

  const [priceError, setPriceError] = useState<string | null>(null);

  const [pageSize] = useState(9);

  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories({ jobsCountSort: 'DESC', query: null }));
  }, [dispatch]);

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

  useEffect(() => {
    if (priceError) {
      return;
    }

    const min = minPrice ? Number(minPrice) : undefined;

    const max = maxPrice ? Number(maxPrice) : undefined;

    dispatch(
      fetchServices({
        page: pageNumber,

        pageSize,

        query: searchTerm || undefined,

        categoryId: categoryId ?? undefined,

        experience: experience ?? undefined,

        minPrice: min !== undefined && !Number.isNaN(min) ? min : undefined,

        maxPrice: max !== undefined && !Number.isNaN(max) ? max : undefined,

        priceSort: priceSort ?? undefined,

        experienceSort: experienceSort ?? undefined,
      }),
    );
  }, [
    dispatch,

    pageNumber,

    pageSize,

    searchTerm,

    categoryId,

    experience,

    minPrice,

    maxPrice,

    priceSort,

    experienceSort,

    priceError,
  ]);

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

      <div className="ServiceCatalog__filters">
        <div className="ServiceCatalog__filter-group">
          <span className="ServiceCatalog__filter-label">Опыт: </span>

          <SelectPicker
            data={experienceOptions}
            value={experience}
            placeholder="Любой"
            onChange={(value) => {
              setExperience(value as number | null);

              setPageNumber(0);
            }}
            style={{ width: 180 }}
          />
        </div>

        <div className="ServiceCatalog__filter-group">
          <span className="ServiceCatalog__filter-label">Цена: </span>

          <div className="ServiceCatalog__price-inputs">
            <Input
              value={minPrice}
              onChange={(val) => setMinPrice(val.trim())}
              placeholder="От"
              type="number"
            />

            <Input
              value={maxPrice}
              onChange={(val) => setMaxPrice(val.trim())}
              placeholder="До"
              type="number"
            />
          </div>

          {priceError ? <span className="ServiceCatalog__error">{priceError}</span> : null}
        </div>

        <div className="ServiceCatalog__filter-group ServiceCatalog__filter-group--sort">
          <span className="ServiceCatalog__filter-label">Сортировка: </span>

          <div className="ServiceCatalog__filter-group--sort--pickers">
            <SelectPicker
              data={sortOptions}
              value={priceSort}
              placeholder="Цена"
              onChange={(val) => {
                setPriceSort((val as 'ASC' | 'DESC' | null) ?? null);

                setPageNumber(0);
              }}
              style={{ width: 160 }}
            />

            <SelectPicker
              data={sortOptions}
              value={experienceSort}
              placeholder="Опыт"
              onChange={(val) => {
                setExperienceSort((val as 'ASC' | 'DESC' | null) ?? null);

                setPageNumber(0);
              }}
              style={{ width: 160 }}
            />
          </div>
        </div>
      </div>

      <div className="ServiceCatalog__grid">
        {items.map((service) => (
          <div className="ServiceCatalog__card-wrapper" key={service.id}>
            <ServiceCard
              title={service.name}
              description={service.description}
              price={service.price.toString()}
              orders={service.ordersCount}
              gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
              coverUrl={service.coverUrl}
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

            coverUrl: selectedService.coverUrl,

            workerName:
              selectedService.user.master?.pseudonym ||
              `${selectedService.user.name} ${selectedService.user.surname}`,

            workerRating: '-',

            workerAvatar: selectedService.user.avatarPath,

            category: selectedService.category.name,

            tags: selectedService.tags.map(String),

            experience: selectedService.user.master?.experience
              ? `${selectedService.user.master.experience} лет опыта`
              : undefined,

            location: selectedService.user.city.name,
          }}
          onOrder={() => {
            setOpenDetailModal(false);

            setOpenServiceModal(true);
          }}
          onMessage={() => {
            console.log('Сообщение мастеру');
          }}
          onFavorite={() => {
            console.log('В избранное');
          }}
          isFavorite={false}
        />
      )}
    </div>
  );
};
