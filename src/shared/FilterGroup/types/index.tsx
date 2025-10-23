export interface FilterItem {
  name: string;
  options: string[];
}

export interface FilterGroupProps {
  filters: FilterItem[];
}
