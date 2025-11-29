import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Loader, Pagination } from 'rsuite';

import { PaymentModal, PaymentResultModal } from '@/pages/MyOrdersPage/ui/modals';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { FilterGroup } from '@/shared/FilterGroup';
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
  const navigate = useNavigate();
  const initialSearch = searchParams.get('search') ?? '';
  const shouldOpenCreate = searchParams.get('create') === 'service';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [pageSize] = useState(9);
  const [pageNumber, setPageNumber] = useState(0); //from vj-68

  const [orderFormKey, setOrderFormKey] = useState(0);
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
    dispatch(
      fetchServices({
        page: pageNumber,
        pageSize,
        query: searchTerm || undefined,
        categoryId: categoryId ?? undefined,
      }),
    );
  }, [dispatch, pageNumber, pageSize, searchTerm, categoryId]); //from vj-68

  const filters = [
    { name: 'Стоимость', options: ['По убыванию', 'По возрастанию'] },
    { name: 'Опыт', options: ['Больше 5 лет', '3–5 лет', 'Менее 3 лет'] },
    { name: 'Рейтинг', options: ['4.9 и выше', '4.5 и выше', '4.0 и выше'] },
  ];

  // const filteredServices = useMemo(() => {
  //   const term = searchTerm.trim().toLowerCase();
  //   if (!term) {
  //     return services;
  //   }
  //   return services.filter(
  //     (s) =>
  //       s.title.toLowerCase().includes(term) ||
  //       s.description.toLowerCase().includes(term) ||
  //       s.workerName.toLowerCase().includes(term),
  //   );
  // }, [searchTerm]);

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

      <FilterGroup filters={filters} />

      <div className="ServiceCatalog__grid">
        {items.map((service) => (
          <div className="ServiceCatalog__card-wrapper" key={service.id}>
            <ServiceCard
              key={service.id}
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
                setOrderFormKey((k) => k + 1);
                setIsDetailModalOpen(true);
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
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedServiceId(null);
          }}
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
          onOrder={() => {
            setIsDetailModalOpen(false);
            setIsOrderModalOpen(true);
          }}
          onMessage={() => {
            console.log('Написать мастеру');
          }}
          onFavorite={() => {
            console.log('Добавить в избранное');
          }}
          isFavorite={false}
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
            setIsDetailModalOpen(false);
            setSelectedServiceId(null);
            navigate('/my-orders');
          }}
        />
      )}
    </div>
  );
};
