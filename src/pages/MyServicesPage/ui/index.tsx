import { Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { deleteService, fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import type { Service } from '@/redux-rtk/store/services/types';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { FiltersGroup } from '@/shared/FilterGroup';
import { CategoryTabs } from '@/shared/FilterTabs';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';
import { PaginationBar } from '@/shared/PaginationBar';
import { SearchInput } from '@/shared/SearchInput';
import { ServiceCreationModal } from '@/shared/ServiceCreationModal/ui';
import { ServiceDeleteModal } from '@/shared/ServiceDeleteModal';
import { ServiceDetailModal } from '@/shared/ServiceDetailModal';
import './my-services.scss';

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) {
    return undefined;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 45) {
    return 'только что';
  }
  const min = Math.floor(sec / 60);
  if (min < 60) {
    return `${min} мин назад`;
  }
  const hours = Math.floor(min / 60);
  if (hours < 24) {
    return `${hours} ч назад`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} дн назад`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} мес назад`;
  }
  const years = Math.floor(months / 12);
  return `${years} г назад`;
};

export type modalMode = 'create' | 'edit';

export const MyServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuthState);
  const { items, status, error, totalElements } = useAppSelector(selectServicesState);
  const { categories, status: utilsStatus } = useAppSelector(selectUtilsState);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [activeFilter, setActiveFilter] = useState('Все категории');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [modalMode, setModalMode] = useState<modalMode>('create');
  const [page, setPage] = useState(0);
  const pageSize = 9;
  const [searchQuery, setSearchQuery] = useState('');
  const [experience, setExperience] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceSort, setPriceSort] = useState<'ASC' | 'DESC' | null>(null);
  const [experienceSort, setExperienceSort] = useState<'ASC' | 'DESC' | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  const myItems = useMemo(
    () => items.filter((service) => service.user?.id === user?.id),
    [items, user?.id],
  );

  const gradientPalette = useMemo(
    () => [
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #5ee7df, #b490ca)',
      'linear-gradient(135deg, #fad961, #f76b1c)',
      'linear-gradient(135deg, #89f7fe, #66a6ff)',
      'linear-gradient(135deg, #c3cfe2, #c3cfe2)',
    ],
    [],
  );

  const getGradientForId = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradientPalette[hash % gradientPalette.length];
  };

  useEffect(() => {
    if (utilsStatus === 'idle') {
      dispatch(fetchCategories({ jobsCountSort: 'DESC', query: null }));
    }
  }, [dispatch, utilsStatus]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    dispatch(
      fetchServices({
        page,
        pageSize,
        masterId: user.id,
        categoryId: categoryId ?? undefined,
        query: searchQuery || undefined,
        experience: experience ?? undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        priceSort: priceSort ?? undefined,
        experienceSort: experienceSort ?? undefined,
      }),
    );
  }, [
    dispatch,
    user?.id,
    categoryId,
    page,
    pageSize,
    searchQuery,
    experience,
    minPrice,
    maxPrice,
    priceSort,
    experienceSort,
  ]);

  const categoryTabs = useMemo(
    () => ['Все категории', ...categories.map((c) => c.category.name)],
    [categories],
  );
  const isLoading = status === 'loading' || status === 'idle';
  const showList = status === 'succeeded' && myItems.length > 0;
  const showEmpty = status === 'succeeded' && myItems.length === 0;
  const totalCount = totalElements ?? 0;
  const hasFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    priceSort !== null ||
    experienceSort !== null ||
    experience !== null;
  const emptyTitle =
    categoryId && !hasFilters
      ? 'В этой категории нет ваших услуг'
      : hasFilters
        ? 'Ничего не найдено'
        : 'У вас пока нет услуг';
  const emptySub =
    categoryId && !hasFilters
      ? 'Создайте услугу в выбранной категории или выберите другую'
      : hasFilters
        ? 'Попробуйте изменить запрос или фильтры'
        : 'Создайте первую услугу, чтобы начать';
  const experienceOptions = useMemo(
    () => [
      { label: 'Все', value: null },
      { label: 'До 1 года', value: 0 },
      { label: 'От 1 года', value: 1 },
      { label: 'Более 3 лет', value: 3 },
      { label: 'Более 5 лет', value: 5 },
      { label: 'Более 10 лет', value: 10 },
    ],
    [],
  );
  const sortOptions = useMemo(
    () => [
      { label: 'По возрастанию', value: 'ASC' as const },
      { label: 'По убыванию', value: 'DESC' as const },
    ],
    [],
  );

  const handleModalOpen = (mode: modalMode, service?: Service) => {
    setModalMode(mode);
    setSelectedService(service ?? null);
    setOpenServiceModal(true);
  };

  const handleModalClose = () => {
    setOpenServiceModal(false);
    setSelectedService(null);
  };

  const handleModalSubmit = () => {
    handleModalClose();
    // обновляем список после create/update
    if (!user?.id) {
      return;
    }
    const nextPage = 0;
    setPage(nextPage);
  };

  const handleDeleteClick = (service: Service) => {
    setDeleteTarget(service);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) {
      return;
    }
    try {
      setIsDeleting(true);
      await dispatch(deleteService(deleteTarget.id)).unwrap();
      setPage(0);
    } catch (err) {
      console.error('Failed to delete service', err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteModalExited = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  };

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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="MyServices">
      <h2 className="MyServices__title">Мои услуги</h2>

      <div className="MyServices__topBar">
        <div className="MyServices__tabs">
          <CategoryTabs
            categories={categoryTabs}
            active={activeFilter}
            onChange={(label) => {
              setActiveFilter(label);
              setPage(0);
              if (label === 'Все категории') {
                setCategoryId(null);
              } else {
                const found = categories.find((c) => c.category.name === label);
                setCategoryId(found?.category.id ?? null);
              }
            }}
          />
        </div>
        <div className="MyServices__actions">
          <Button
            className="MyServices__createBtn"
            title="Разместить услугу"
            onClick={() => handleModalOpen('create')}
          >
            <Plus /> Создать услугу
          </Button>
        </div>
      </div>

      <div className="MyServices__controls">
        <SearchInput
          placeholder="Поиск по названию или описанию"
          onSearch={(value) => {
            setSearchQuery(value);
            setPage(0);
          }}
          defaultValue={searchQuery}
        />

        <FiltersGroup
          experience={experience}
          onExperienceChange={(v) => {
            setExperience(v);
            setPage(0);
          }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          priceError={priceError ?? undefined}
          priceSort={priceSort}
          experienceSort={experienceSort}
          onPriceSortChange={(v) => {
            setPriceSort(v);
            setPage(0);
          }}
          onExperienceSortChange={(v) => {
            setExperienceSort(v);
            setPage(0);
          }}
          experienceOptions={experienceOptions}
          sortOptions={sortOptions}
          showExperience={false}
        />
      </div>

      <div className="MyServices__body">
        {isLoading && (
          <div className="MyServices__loader">
            <CustomLoader size="md" />
          </div>
        )}

        {status === 'failed' && !isLoading && (
          <div className="MyServices__empty">
            <div className="MyServices__empty-title">Не удалось загрузить услуги</div>
            <div className="MyServices__empty-sub">{error ?? 'Попробуйте позже'}</div>
          </div>
        )}

        {showEmpty && (
          <div className="MyServices__empty">
            <div className="MyServices__empty-title">{emptyTitle}</div>
            <div className="MyServices__empty-sub">{emptySub}</div>
          </div>
        )}

        {showList && (
          <div className="MyServices__list">
            {myItems.map((service) => {
              const coverUrl =
                service.coverUrl && !service.coverUrl.includes('placehold.co')
                  ? service.coverUrl
                  : undefined;
              const createdLabel = formatTimeAgo(service.createdAt);
              return (
                <MyServiceCard
                  mode="my"
                  key={service.id}
                  id={service.id}
                  title={service.name}
                  description={service.description}
                  category={service.category?.name}
                  price={service.price}
                  location={service.user?.city?.name}
                  cover={coverUrl}
                  gradient={!coverUrl ? getGradientForId(service.id) : undefined}
                  tags={service.tags?.map((t) => t.name)}
                  createdAt={createdLabel}
                  onEdit={() => {
                    handleModalOpen('edit', service);
                  }}
                  onDelete={() => handleDeleteClick(service)}
                  onClick={() => {
                    setPreviewService(service);
                    setPreviewOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}

        {showList && totalCount > pageSize && (
          <div className="MyServices__pagination">
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={totalCount}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {openServiceModal && (
        <ServiceCreationModal
          open={openServiceModal}
          onClose={handleModalClose}
          mode={modalMode}
          onSubmit={handleModalSubmit}
          onDelete={() => selectedService && handleDeleteClick(selectedService)}
          showDelete={modalMode === 'edit'}
          initialValues={
            selectedService
              ? {
                  name: selectedService.name,
                  description: selectedService.description,
                  price: selectedService.price,
                  categoryId: selectedService.category?.id ?? null,
                  tags: selectedService.tags?.map((t) => t.id) ?? [],
                  coverUrl: selectedService.coverUrl,
                }
              : undefined
          }
          coverUrl={selectedService?.coverUrl}
          serviceId={selectedService?.id}
        />
      )}

      <ServiceDeleteModal
        open={deleteModalOpen}
        serviceName={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={isDeleting}
        onExited={handleDeleteModalExited}
      />

      {previewService && (
        <ServiceDetailModal
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewService(null);
          }}
          disableActions
          service={{
            id: previewService.id,
            title: previewService.name,
            description: previewService.description,
            price: previewService.price,
            orders: previewService.ordersCount,
            gradient:
              previewService.coverUrl && !previewService.coverUrl.includes('placehold.co')
                ? 'linear-gradient(135deg, #4facfe, #00f2fe)'
                : getGradientForId(previewService.id),
            coverUrl:
              previewService.coverUrl && !previewService.coverUrl.includes('placehold.co')
                ? previewService.coverUrl
                : undefined,
            workerName:
              previewService.user.master?.pseudonym ||
              `${previewService.user.name} ${previewService.user.surname}`,
            workerRating: '-',
            workerAvatar: previewService.user.avatarPath,
            category: previewService.category?.name,
            tags: previewService.tags?.map((t) => t.name),
            experience: previewService.user.master?.experience
              ? `${previewService.user.master.experience} лет опыта`
              : undefined,
            location: previewService.user.city?.name,
            user: previewService.user,
          }}
        />
      )}
    </div>
  );
};
