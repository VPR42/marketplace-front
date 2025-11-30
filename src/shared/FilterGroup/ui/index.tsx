import React from 'react';
import { Input, SelectPicker } from 'rsuite';

import type { FiltersGroupProps } from '../types';
import './filters-group.scss';

export const FiltersGroup: React.FC<FiltersGroupProps> = ({
  experience,
  onExperienceChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  priceError,
  priceSort,
  experienceSort,
  onPriceSortChange,
  onExperienceSortChange,
  experienceOptions,
  sortOptions,
}) => (
  <div className="FiltersGroup__filters">
    <div className="FiltersGroup__filter-group">
      <span className="FiltersGroup__filter-label">Опыт: </span>
      <SelectPicker
        className="FiltersGroup__picker"
        searchable={false}
        data={experienceOptions}
        value={experience}
        placeholder="Любой"
        onChange={(value) => onExperienceChange(value as number | null)}
        style={{ width: 180 }}
      />
    </div>

    <div className="FiltersGroup__filter-group">
      <span className="FiltersGroup__filter-label">Цена: </span>
      <div className="FiltersGroup__price-inputs">
        <Input
          value={minPrice}
          onChange={(val) => {
            const num = Number(val.trim());
            if (val.trim() === '' || (num >= 0 && !isNaN(num))) {
              onMinPriceChange(val.trim());
            }
          }}
          placeholder="От"
          min="0"
          type="number"
        />
        <Input
          value={maxPrice}
          onChange={(val) => {
            const num = Number(val.trim());
            if (val.trim() === '' || (num >= 0 && !isNaN(num))) {
              onMaxPriceChange(val.trim());
            }
          }}
          placeholder="До"
          min="0"
          type="number"
        />
      </div>
      {priceError && <span className="FiltersGroup__error">{priceError}</span>}
    </div>

    <div className="FiltersGroup__filter-group FiltersGroup__filter-group--sort">
      <span className="FiltersGroup__filter-label">Сортировка: </span>
      <div className="FiltersGroup__filter-group--sort--pickers">
        <SelectPicker
          className="FiltersGroup__picker"
          searchable={false}
          data={sortOptions}
          value={priceSort}
          placeholder="Цена"
          onChange={(val) => onPriceSortChange(val as 'ASC' | 'DESC' | null)}
          style={{ width: 160 }}
        />
        <SelectPicker
          className="FiltersGroup__picker"
          searchable={false}
          data={sortOptions}
          value={experienceSort}
          placeholder="Опыт"
          onChange={(val) => onExperienceSortChange(val as 'ASC' | 'DESC' | null)}
          style={{ width: 160 }}
        />
      </div>
    </div>
  </div>
);
