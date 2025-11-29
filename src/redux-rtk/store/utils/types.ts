export interface City {
  id: number;
  region: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithCount {
  category: Category;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
}
