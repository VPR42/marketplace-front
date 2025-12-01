export interface City {
  id: number;
  region?: string;
  name: string;
}

export interface MasterInfo {
  experience?: number;
  description?: string;
  pseudonym?: string;
  phoneNumber?: string;
  skills?: string[];
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
}

export interface UserShort {
  id: string;
  email?: string;
  name: string;
  surname: string;
  patronymic?: string;
  avatarPath?: string | null;
  city?: City | null;
  master?: MasterInfo | null;
}

export interface TagDto {
  id: number;
  name: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface FavoriteJob {
  id: string;
  name: string;

  description: string;
  price: number;
  coverUrl: string | null;
  createdAt: string;

  user: UserShort;

  category: CategoryDto;

  tags: TagDto[];
  ordersCount: number;
}

export interface FavoritesState {
  items: FavoriteJob[];
  filtered: FavoriteJob[];
  filterParams: FetchFavoritesParams | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type FetchFavoritesParams = {
  page?: number;
  pageSize?: number;
  query?: string | null;
  categoryId?: number | null;
  experience?: number | null;
  minPrice?: number;
  maxPrice?: number;
  priceSort?: 'ASC' | 'DESC' | null;
  experienceSort?: 'ASC' | 'DESC' | null;
};
