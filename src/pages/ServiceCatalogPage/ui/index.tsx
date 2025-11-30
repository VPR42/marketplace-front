import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Pagination } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { PaymentModal, PaymentResultModal } from '@/pages/MyOrdersPage/ui/modals';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import {
  addToFavorites,
  fetchFavorites,
  removeFromFavorites,
} from '@/redux-rtk/store/favorites/favoriteThunks';
import { selectFilteredFavorites } from '@/redux-rtk/store/favorites/selectors';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { FiltersGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCard } from '@/shared/ServiceCard/ui';
import { ServiceCreationModal } from '@/shared/ServiceCreationModal/ui';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';

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
  const favorites = useAppSelector(selectFilteredFavorites);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') ?? '';

  const shouldOpenCreate = searchParams.get('create') === 'service';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const [openServiceModal, setOpenServiceModal] = useState(false);

  const [openDetailModal, setOpenDetailModal] = useState(false);

  // const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

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

  // const [_orderFormKey, setOrderFormKey] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    open: boolean;
    status: 'success' | 'error';
    methodMask: string;
  }>({
    open: false,
    status: 'success',
    methodMask: '',
  }); //from khasso

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

  const isFavorite = useMemo(() => {
    if (!selectedService) {
      return false;
    }
    return favorites.some((f) => f.id === selectedService.id);
  }, [favorites, selectedService]);

  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);

  const handleToggleFavorite = useCallback(
    async (serviceId: string, makeFavorite: boolean) => {
      if (!serviceId) {
        return;
      }
      if (togglingFavoriteId === serviceId) {
        return;
      }

      setTogglingFavoriteId(serviceId);

      try {
        const isAlready = favorites.some((f) => f.id === serviceId);

        if (makeFavorite && !isAlready) {
          await dispatch(addToFavorites(serviceId)).unwrap();
        } else if (!makeFavorite && isAlready) {
          await dispatch(removeFromFavorites(serviceId)).unwrap();
        }

        await dispatch(fetchFavorites()).unwrap();
      } catch (err) {
        console.error('toggle favorite failed', err);
      } finally {
        setTogglingFavoriteId(null);
      }
    },
    [dispatch, favorites, togglingFavoriteId],
  );

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
        <FiltersGroup
          experience={experience}
          onExperienceChange={(v) => {
            setExperience(v);
            setPageNumber(0);
          }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          priceError={priceError || undefined}
          priceSort={priceSort}
          experienceSort={experienceSort}
          onPriceSortChange={(v) => {
            setPriceSort(v);
            setPageNumber(0);
          }}
          onExperienceSortChange={(v) => {
            setExperienceSort(v);
            setPageNumber(0);
          }}
          experienceOptions={experienceOptions as { label: string; value: number | null }[]}
          sortOptions={sortOptions as { label: string; value: 'ASC' | 'DESC' }[]}
        />
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
                console.log(service.tags);
                setOpenDetailModal(true);
              }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="ServiceCatalog__loader">
            <CustomLoader size="md" content="" />
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
        <ServiceCreationModal
          open={openServiceModal}
          onClose={() => setOpenServiceModal(false)}
          mode="create"
          onSubmit={() => setOpenServiceModal(false)}
        />
      )}

      {selectedService && (
        <ServiceDetailModal
          open={openDetailModal}
          onClose={() => {
            setOpenDetailModal(false);
            setSelectedServiceId(null);
          }}
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

            tags: selectedService.tags.map((elem) => elem.name),

            experience: selectedService.user.master?.experience
              ? `${selectedService.user.master.experience} лет опыта`
              : undefined,

            location: selectedService.user.city.name,
          }}
          onOrder={() => {
            setOpenDetailModal(false);

            setOpenServiceModal(true);
          }}
          onMessage={() => console.log('Написать мастеру')}
          isFavorite={isFavorite}
          onFavorite={() => {
            const currentlyFavorite = favorites.some((f) => f.id === selectedService.id);
            handleToggleFavorite(selectedService.id, !currentlyFavorite);
          }}
          isTogglingFavorite={togglingFavoriteId === selectedService.id}
        />
      )}

      {selectedService && (
        <PaymentModal
          open={isPaymentModalOpen}
          title="Оплата услуги"
          serviceTitle={selectedService.name}
          price={Number(selectedService.price)}
          fee={0}
          methods={[
            { id: 'card1', brand: 'Mastercard', masked: '•••• 1234', expire: '08/27' },
            { id: 'card2', brand: 'Visa', masked: '•••• 9876', expire: '01/29' },
          ]}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={(methodId) => {
            const methodMask = methodId === 'card2' ? '•••• 9876' : '•••• 1234';
            setIsPaymentModalOpen(false);
            setPaymentResult({ open: true, status: 'success', methodMask });
          }}
        />
      )}
      {selectedService && (
        <PaymentResultModal
          open={paymentResult.open}
          status={paymentResult.status}
          orderId={selectedService.id}
          amount={Number(selectedService.price)}
          cardMask={paymentResult.methodMask || '•••• 1234'}
          datetime={new Date().toLocaleString('ru-RU')}
          onClose={() => setPaymentResult((prev) => ({ ...prev, open: false }))}
          onPrimary={() => setPaymentResult((prev) => ({ ...prev, open: false }))}
          onSecondary={() => {
            setPaymentResult((prev) => ({ ...prev, open: false }));
            setOpenDetailModal(false);
            setSelectedServiceId(null);
            navigate('/my-orders');
          }}
        />
      )}
    </div>
  );
};
