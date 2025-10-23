import { SelectPicker } from 'rsuite';

import type { FilterGroupProps } from '@/shared/FilterGroup/types';
import './filter-group.scss';

export const FilterGroup = ({ filters }: FilterGroupProps) => (
  <div className="FilterGroup">
    {filters.map((filter) => {
      const data = filter.options.map((opt) => ({
        label: opt,
        value: opt,
      }));

      return (
        <div key={filter.name} className="FilterGroup__item">
          <SelectPicker
            className="FilterGroup__select"
            data={data}
            placeholder={filter.name}
            searchable={false}
            cleanable={false}
            placement="bottomStart"
          />
        </div>
      );
    })}
  </div>
);
