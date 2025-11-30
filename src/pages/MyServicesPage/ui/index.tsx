import { Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'rsuite';

import { CustomLoader } from '@/components/CustomLoader/ui';
import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import { selectServicesState } from '@/redux-rtk/store/services/selectors';
import { deleteService, fetchServices } from '@/redux-rtk/store/services/servicesThunks';
import type { Service } from '@/redux-rtk/store/services/types';
import { CategoryTabs } from '@/shared/FilterTabs';
import { MyServiceCard } from '@/shared/MyServicesCard/ui';
import { ServiceCreationModal } from '@/shared/ServiceCreationModal/ui';
import { ServiceDeleteModal } from '@/shared/ServiceDeleteModal';
import './my-services.scss';

export type modalMode = 'create' | 'edit';

export const MyServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuthState);
  const { items, status, error } = useAppSelector(selectServicesState);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [activeFilter, setActiveFilter] = useState('Все категории');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [availableCategories, setAvailableCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [modalMode, setModalMode] = useState<modalMode>('create');
  const [pageLoading, setPageLoading] = useState(true);
  const myItems = useMemo(
    () => items.filter((service) => service.user?.id === user?.id),
    [items, user?.id],
  );

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const load = async () => {
      setPageLoading(true);
      try {
        await dispatch(
          fetchServices({
            page: 0,
            pageSize: 50,
            masterId: user.id,
            categoryId: categoryId ?? undefined,
          }),
        ).unwrap();
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [dispatch, user?.id, categoryId]);

  const myCategories = useMemo(() => {
    const map = new Map<number, string>();
    myItems.forEach((service) => {
      const id = service.category?.id;
      const name = service.category?.name;
      if (id !== undefined && id !== null && name) {
        map.set(id, name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [myItems]);

  useEffect(() => {
    if (myCategories.length === 0) {
      return;
    }
    setAvailableCategories((prev) => {
      const map = new Map<number, string>();
      prev.forEach((c) => map.set(c.id, c.name));
      myCategories.forEach((c) => map.set(c.id, c.name));
      return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    });
  }, [myCategories]);

  const categoryTabs = useMemo(
    () => ['Все категории', ...availableCategories.map((c) => c.name)],
    [availableCategories],
  );
  const isLoading = status === 'loading' || status === 'idle';
  const showList = status === 'succeeded' && myItems.length > 0;
  const showEmpty = status === 'succeeded' && myItems.length === 0;

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
    setPageLoading(true);
    dispatch(
      fetchServices({
        page: 0,
        pageSize: 50,
        masterId: user.id,
        categoryId: categoryId ?? undefined,
      }),
    )
      .unwrap()
      .finally(() => setPageLoading(false));
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
      setPageLoading(true);
      await dispatch(deleteService(deleteTarget.id)).unwrap();
      await dispatch(
        fetchServices({
          page: 0,
          pageSize: 50,
          masterId: user?.id ?? '',
          categoryId: categoryId ?? undefined,
        }),
      );
    } catch (err) {
      console.error('Failed to delete service', err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setPageLoading(false);
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
              if (label === 'Все категории') {
                setCategoryId(null);
              } else {
                const found = availableCategories.find((c) => c.name === label);
                setCategoryId(found?.id ?? null);
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

      <div className="MyServices__body">
        {isLoading && (
          <div className="MyServices__list MyServices__list--loader">
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
            <div className="MyServices__empty-title">У вас пока нет услуг</div>
            <div className="MyServices__empty-sub">Создайте первую услугу, чтобы начать</div>
          </div>
        )}

        {showList && (
          <div className="MyServices__list">
            {myItems.map((service) => (
              <MyServiceCard
                mode="my"
                key={service.id}
                id={service.id}
                title={service.name}
                description={service.description}
                category={service.category?.name}
                price={service.price}
                location={service.user?.city?.name}
                cover={service.coverUrl}
                tags={service.tags?.map((t) => t.name)}
                createdAt={service.createdAt}
                onEdit={() => {
                  handleModalOpen('edit', service);
                }}
                onDelete={() => handleDeleteClick(service)}
              />
            ))}
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
    </div>
  );
};
