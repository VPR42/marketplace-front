import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchInput } from '@/shared/SearchInput';

import './landing.scss';

interface CategoryItem {
  title: string;
  count: string;
  icon: string;
}

interface ServiceItem {
  title: string;
  location: string;
  price: string;
  tags: string[];
  gradient: string;
}

interface MasterItem {
  name: string;
  direction: string;
}

interface StepItem {
  title: string;
  description: string;
}

const categories: CategoryItem[] = [
  { title: 'Уборка', count: '2 200 мастеров', icon: '🧹' },
  { title: 'Электрика', count: '1 300 мастеров', icon: '💡' },
  { title: 'Сантехника', count: '1 200 мастеров', icon: '🚰' },
  { title: 'IT услуги', count: '1 000 мастеров', icon: '💻' },
  { title: 'Кондиционеры', count: '600 мастеров', icon: '❄️' },
];

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
];

const masters: MasterItem[] = [
  { name: 'Мария Иванова', direction: 'Уборка' },
  { name: 'Андрей Кузнецов', direction: 'Сборка мебели' },
  { name: 'Сергей Лебедев', direction: 'Сантехника' },
  { name: 'Дмитрий Козлов', direction: 'Плотник' },
];

const steps: StepItem[] = [
  { title: '1. Опишите задачу', description: 'Что и когда нужно сделать, адрес и бюджет.' },
  { title: '2. Получите отклики', description: 'Мастера предложат цену и сроки.' },
  { title: '3. Выберите мастера', description: 'Договоритесь в чате и оплатите удобным способом.' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const heroChips = ['Уборка', 'Свеж. цены', 'С гарантией', 'Финализация (IT)'];

  const staticServices = useMemo(() => services, []);

  const goToFeed = (extraParams?: string) => {
    const query = extraParams ? `?${extraParams}` : '';
    navigate(`/feed${query}`);
  };

  const handleSearch = () => {
    const query = searchValue.trim() ? `?search=${encodeURIComponent(searchValue.trim())}` : '';
    navigate(`/feed${query}`);
  };

  return (
    <div className="Landing">
      <div className="Landing__container">
        <section className="Landing__hero">
          <div className="Landing__hero-left">
            <h1>Найдём мастера под вашу задачу</h1>
            <p>Тысячи проверенных специалистов рядом</p>

            <div className="Landing__hero-card">
              <div className="Landing__search-row">
                <div className="Landing__field Landing__field--wide">
                  <SearchInput
                    placeholder="Что нужно сделать?"
                    onSearch={(value) => setSearchValue(value)}
                    defaultValue={searchValue}
                  />
                </div>
                <select className="Landing__select" defaultValue="Все">
                  <option>Все категории</option>
                  <option>Уборка</option>
                  <option>Сантехника</option>
                  <option>IT услуги</option>
                </select>
                <button type="button" className="Landing__search-btn" onClick={handleSearch}>
                  Найти мастера
                </button>
              </div>
              <div className="Landing__chips">
                {heroChips.map((chip) => (
                  <button key={chip} type="button" className="Landing__chip">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="Landing__hero-aside" aria-hidden />
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Популярные категории</h2>
            <button type="button" className="Landing__pill" onClick={() => goToFeed()}>
              Смотреть все
            </button>
          </div>
          <div className="Landing__cats">
            {categories.map((cat) => (
              <div key={cat.title} className="Landing__cat">
                <div className="Landing__cat-ico">{cat.icon}</div>
                <div>
                  <b>{cat.title}</b>
                  <div className="Landing__cat-muted">{cat.count}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Рядом с вами</h2>
            <button type="button" className="Landing__pill" onClick={() => goToFeed()}>
              Открыть каталог
            </button>
          </div>
          <div className="Landing__services">
            {staticServices.map((service) => (
              <div key={service.title} className="Landing__card">
                <div className="Landing__cover" style={{ background: service.gradient }}>
                  <div className="Landing__cover-title">{service.title}</div>
                </div>
                <div className="Landing__body">
                  <div className="Landing__meta">{service.location}</div>
                  <div className="Landing__price">{service.price}</div>
                  <div className="Landing__tags">
                    {service.tags.map((tag) => (
                      <span key={tag} className="Landing__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="Landing__section">
          <div className="Landing__section-head">
            <h2>Мастера, готовые помочь</h2>
            <button type="button" className="Landing__pill" onClick={() => goToFeed()}>
              Все мастера
            </button>
          </div>
          <div className="Landing__masters">
            {masters.map((master) => (
              <div key={master.name} className="Landing__master">
                <div className="Landing__master-ava">
                  {master.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="Landing__master-name">{master.name}</div>
                  <div className="Landing__master-dir">{master.direction}</div>
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
          <button type="button" className="Landing__btn" onClick={() => goToFeed('create=service')}>
            Разместить услугу
          </button>
        </section>
      </div>
    </div>
  );
};
