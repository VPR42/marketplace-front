export interface FiltersGroupProps {
  experience: number | null;
  onExperienceChange: (value: number | null) => void;

  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  priceError?: string;

  priceSort: 'ASC' | 'DESC' | null;
  experienceSort: 'ASC' | 'DESC' | null;
  onPriceSortChange: (value: 'ASC' | 'DESC' | null) => void;
  onExperienceSortChange: (value: 'ASC' | 'DESC' | null) => void;

  experienceOptions: { label: string; value: number | null }[];
  sortOptions: { label: string; value: 'ASC' | 'DESC' | null }[];
  showExperience?: boolean;
}
