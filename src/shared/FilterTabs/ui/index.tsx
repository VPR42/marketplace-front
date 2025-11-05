import { Button } from 'rsuite';

import type { CategoryTabsProps } from '@/shared/FilterTabs/types';
import './filter-tabs.scss';

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, active, onChange }) => (
  <div className="CategoryTabs">
    {categories.map((category) => (
      <Button
        key={category}
        className={`CategoryTabs__item ${category === active ? 'CategoryTabs__item--active' : ''}`}
        onClick={() => onChange(category)}
      >
        {category}
      </Button>
    ))}
  </div>
);
