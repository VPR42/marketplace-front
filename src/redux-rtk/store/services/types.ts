import type { UserExtended } from '../profile/types';
import type { Category } from '../utils/types';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  coverUrl: string;
  createdAt: string;
  user: UserExtended;
  category: Category;
  tags: number[];
  ordersCount: number;
}

export interface ServiceCreateRequest {
  name: string;
  description: string;
  price: number;
  coverUrl: string;
  categoryId: number;
  tags: number[];
}

export type ServiceUpdateRequest = ServiceCreateRequest;

export interface ServiceQueryParams {
  page?: number;
  pageSize?: number;
  masterId?: string;
  query?: string;
  categoryId?: number;
  skills?: string[];
  tags?: number[];
  minPrice?: number;
  maxPrice?: number;
  experience?: number;
  cityId?: number;
  minOrders?: number;
  priceSort?: 'ASC' | 'DESC';
  ordersCountSort?: 'ASC' | 'DESC';
  experienceSort?: 'ASC' | 'DESC';
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ServicesState {
  items: Service[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
  currentService: Service | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
