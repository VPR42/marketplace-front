export interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}
