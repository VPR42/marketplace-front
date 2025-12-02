export interface OrderItem {
  orderId: number;
  status: string;
  orderedAt: string;
  jobName: string;
  jobDescription: string;
  jobPrice: number;
  jobCoverUrl: string;
  categoryName: string;
  masterFullName: string;
  masterCityId: number;
}

export interface OrdersResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: OrderItem[];
}

export interface OrdersQueryParams {
  status?: string;
  search?: string;
  categoryId?: number;
  isMasterOrder?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface OrdersState {
  data: OrdersResponse | null;
  loading: boolean;
  error: string | null;
}

export interface CreateOrderResponse {
  id: number;
  status: string;
  orderedAt: string;
  job: {
    id: string;
    name: string;
    description: string;
    price: number;
    coverUrl?: string;
    category?: {
      id: number;
      name: string;
    };
    master?: {
      id: string;
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
  };
}
