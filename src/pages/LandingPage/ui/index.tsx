import { isAxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import type { Service } from '@/redux-rtk/store/services/types';
import { selectUtilsState } from '@/redux-rtk/store/utils/selectors';
import { fetchCategories } from '@/redux-rtk/store/utils/utilsThunks';
import { api } from '@/shared/axios.config';
import { SearchInput } from '@/shared/SearchInput';

import './landing.scss';

interface ServiceItem {
  title: string;
  location: string;
  price: string;
  tags: string[];
  gradient: string;
}

interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

interface PopularCategory {
  id?: number | null;
  title: string;
  count: string;
  icon: string;
}

interface StepItem {
  title: string;
  description: string;
}

const categoryIcons: Record<string, string> = {
  уборка: '🧹',
  клининг: '🧽',
  электрика: '💡',
  сантехника: '🚰',
  ремонт: '🛠️',
  'it услуги': '💻',
  it: '💻',
  доставка: '📦',
  курьер: '🚚',
  кондиционеры: '❄️',
  строительство: '🏗️',
};

const heroStats = ['Мастера под любую задачу', 'Быстрые отклики и старт работ'];

const services: ServiceItem[] = [
  {
    title: 'Генеральная уборка',
    location: 'Клининг после ремонта · Мария Миронов',
    price: 'от 3 500 ₽',
    tags: ['Экологичная химия', 'Моёт окна'],
    gradient: 'linear-gradient(135deg, #5a55fa, #8e8cf1)',
  },
  {
    title: 'Сборка мебели',
    location: 'Сборка шкафов · Андрей Морис',
    price: 'от 1 200 ₽/час',
    tags: ['Свой инструмент', 'Гарантия'],
    gradient: 'linear-gradient(135deg, #5fd4ff, #3b82f6)',
  },
  {
    title: 'Сантехника',
    location: 'Устранение протечек · Сергей Моргун',
    price: 'от 2 000 ₽',
    tags: ['Срочный вызов', '24/7'],
    gradient: 'linear-gradient(135deg, #43ef9e, #00c853)',
  },
  {
    title: 'Доставка и помощь',
    location: 'Курьерская помощь · Антон Белый',
    price: 'от 800 ₽',
    tags: ['Быстро', 'По городу'],
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)',
  },
];

const benefits: BenefitItem[] = [
  {
    title: 'Публикуйте услуги',
    description: 'Мастер создаёт карточку с описанием, ценой и доступностью за пару минут.',
    icon: '🛠️',
  },
  {
    title: 'Видимость в каталоге',
    description: 'Клиенты находят мастера по категориям и поиску, без лишних звонков.',
    icon: '🔎',
  },
  {
    title: 'Честные условия',
    description: 'Простые договорённости по цене и срокам прямо в сервисе.',
    icon: '📄',
  },
  {
    title: 'Помощь по пути',
    description: 'Подскажем по сервису и поможем с вопросами, если они появятся.',
    icon: '🤝',
  },
];

const steps: StepItem[] = [
  {
    title: '1. Разместите услугу',
    description: 'Опишите, что делаете, укажите цену, город и удобный формат работы.',
  },
  {
    title: '2. Клиенты находят вас',
    description: 'Услуга появляется в каталоге и поиске — отклики приходят напрямую.',
  },
  {
    title: '3. Общение и заказ',
    description: 'Обсуждайте детали, подтверждайте работу и фиксируйте договорённости.',
  },
];

export const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories: utilsCategories, status: utilsStatus } = useAppSelector(selectUtilsState);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [landingServices, setLandingServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const maxHeroChips = 4;
  const heroChips = useMemo(
    () =>
      utilsCategories
        .map((c) => ({ label: c.category.name, id: c.category.id }))
        .filter((c) => Boolean(c.label))
        .slice(0, maxHeroChips),
    [maxHeroChips, utilsCategories],
  );

  const staticServices = useMemo(() => services, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const { data } = await api.get('/feed/jobs', {
          params: {
            page: 0,
            pageSize: 4,
          },
          signal: controller.signal,
        });
        setLandingServices(data?.content ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          if (
            isAxiosError(error) &&
            (error.response?.status === 404 ||
              error.response?.status === 401 ||
              error.response?.status === 500)
          ) {
            // тихо показываем заглушки, без ошибки
            setServicesError(null);
            setLandingServices([]);
          } else {
            setServicesError('Не удалось загрузить услуги');
            setLandingServices([]);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const popularCategories: PopularCategory[] = useMemo(
    () =>
      utilsCategories
        .filter((c) => (c.count ?? 0) > 0)
        .slice(0, 8)
        .map((c) => {
          const name = c.category.name;
          const key = name.toLowerCase();
          const icon =
            Object.entries(categoryIcons).find(([k]) => key.includes(k))?.[1] ??
            (name ? name[0].toUpperCase() : '?');
          return {
            id: c.category.id,
            title: name,
            count: `${c.count ?? 0} услуг`,
            icon,
          };
        }),
    [utilsCategories],
  );
  useEffect(() => {
    if (utilsStatus === 'idle') {
      dispatch(fetchCategories({ jobsCountSort: 'DESC' }));
    }
  }, [dispatch, utilsStatus]);

  const goToFeed = (params?: {
    search?: string;
    categoryId?: number | null;
    create?: string;
    serviceId?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params?.search) {
      sp.set('search', params.search);
    }
    if (params?.categoryId) {
      sp.set('categoryId', String(params.categoryId));
    }
    if (params?.create) {
      sp.set('create', params.create);
    }
    if (params?.serviceId) {
      sp.set('serviceId', params.serviceId);
    }
    const query = sp.toString();
    navigate(query ? `/feed?${query}` : '/feed');
  };

  const handleSearch = () => {
    const value = searchValue.trim();
    goToFeed(
      value || selectedCategoryId !== null
        ? {
            search: value || undefined,
            categoryId: selectedCategoryId ?? undefined,
          }
        : undefined,
    );
  };

  return (
    <div className="Landing">
      <div className="Landing__container">
        <section className="Landing__hero">
          <div className="Landing__hero-left">
            <div className="Landing__meta">
              {heroStats.map((item) => (
                <span key={item} className="Landing__meta-pill">
                  {item}
                </span>
              ))}
            </div>
            <h1>Найдём мастера под вашу задачу</h1>
            <p>Тысячи проверенных специалистов рядом. Опишите задачу — мы подберём подходящих.</p>

            <div className="Landing__hero-card">
              <div className="Landing__search-row">
                <div className="Landing__field Landing__field--wide">
                  <SearchInput
                    placeholder="Что нужно сделать?"
                    onSearch={(value) => setSearchValue(value)}
                    defaultValue={searchValue}
                  />
                </div>
                <button type="button" className="Landing__search-btn" onClick={handleSearch}>
                  Найти мастера
                </button>
              </div>
              <div className="Landing__chips">
                {heroChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className={`Landing__chip ${
                      chip.id !== null && chip.id === selectedCategoryId
                        ? 'Landing__chip--active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedCategoryId((prev) => (prev === chip.id ? null : (chip.id ?? null)))
                    }
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <img className="Landing__hero-aside" src="/main_logo.png" />
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Популярные категории</h2>
            <button type="button" className="Landing__pill" onClick={() => goToFeed()}>
              Смотреть все
            </button>
          </div>
          <div className="Landing__cats">
            {popularCategories.map((cat) => (
              <div
                key={cat.id ?? cat.title}
                className="Landing__cat"
                onClick={() => goToFeed({ categoryId: cat.id ?? undefined })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    goToFeed({ categoryId: cat.id ?? undefined });
                  }
                }}
              >
                <div className="Landing__cat-ico">{cat.icon}</div>
                <div>
                  <b className="Landing__cat-title">{cat.title}</b>
                  <div className="Landing__cat-muted">{cat.count}</div>
                </div>
              </div>
            ))}
            {!popularCategories.length && (
              <div className="Landing__cats-placeholder">Загружаем категории...</div>
            )}
          </div>
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Подборка услуг</h2>
            <button type="button" className="Landing__pill" onClick={() => goToFeed()}>
              Открыть каталог
            </button>
          </div>
          <div className="Landing__services-wrapper">
            {servicesLoading && (
              <div className="Landing__services-overlay">
                <div className="Landing__services-loading">Загружаем подборку...</div>
              </div>
            )}
            <div className="Landing__services">
              {(landingServices.length ? landingServices : staticServices).map((service, idx) => {
                const gradientPalette = [
                  'linear-gradient(135deg, #5a55fa, #8e8cf1)',
                  'linear-gradient(135deg, #5fd4ff, #3b82f6)',
                  'linear-gradient(135deg, #43ef9e, #00c853)',
                ];

                const isDynamic = 'id' in service;
                const serviceId = isDynamic ? service.id : null;
                const title = isDynamic ? service.name : (service as ServiceItem).title;
                const meta = isDynamic
                  ? [service.category?.name, service.user?.master?.pseudonym || service.user?.name]
                      .filter(Boolean)
                      .join(' · ')
                  : (service as ServiceItem).location;
                const price = isDynamic
                  ? service.price
                    ? `от ${service.price} ₽`
                    : 'Цена по договорённости'
                  : (service as ServiceItem).price;
                const tags = isDynamic
                  ? (service.tags?.map((t) => t.name).slice(0, 3) ?? [])
                  : (service as ServiceItem).tags;
                const coverUrl = isDynamic ? service.coverUrl : undefined;
                const gradient = gradientPalette[idx % gradientPalette.length];

                const coverStyle = coverUrl
                  ? {
                      backgroundImage: `url(${coverUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { background: gradient };

                return (
                  <div
                    key={isDynamic ? service.id : (service as ServiceItem).title}
                    onClick={() => {
                      if (!serviceId) {
                        return;
                      }

                      goToFeed({ serviceId });
                    }}
                    className="Landing__card"
                  >
                    <div className="Landing__cover" style={coverStyle}>
                      <div className="Landing__cover-title">{title}</div>
                    </div>
                    <div className="Landing__body">
                      <div className="Landing__meta">{meta}</div>
                      <div className="Landing__price">{price}</div>
                      <div className="Landing__tags">
                        {tags.map((tag) => (
                          <span key={tag} className="Landing__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {servicesError && !landingServices.length ? (
              <div className="Landing__services-error">{servicesError}</div>
            ) : null}
          </div>
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Почему нас выбирают</h2>
          </div>
          <div className="Landing__benefits">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="Landing__benefit">
                <div className="Landing__benefit-ico">{benefit.icon}</div>
                <div>
                  <div className="Landing__benefit-title">{benefit.title}</div>
                  <div className="Landing__benefit-desc">{benefit.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Как это работает</h2>
          </div>
          <div className="Landing__steps">
            {steps.map((step) => (
              <div key={step.title} className="Landing__step">
                <b>{step.title}</b>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="Landing__section Landing__cta">
          <div>
            <h3>Готовы разместить заказ?</h3>
            <p>Опишите задачу — первые отклики придут в течение 10–15 минут.</p>
          </div>
          <button
            type="button"
            className="Landing__btn"
            onClick={() => goToFeed({ create: 'service' })}
          >
            Разместить услугу
          </button>
        </section>
      </div>
    </div>
  );
};
