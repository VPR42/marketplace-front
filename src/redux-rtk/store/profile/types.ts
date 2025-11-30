export interface OrdersInfo {
  ordersCount: number;
  completedPercent: number;
}

export interface MasterInfo {
  experience: number;
  description: string;
  pseudonym: string;
  phoneNumber: string;
  about: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  avatarPath: string;
  createdAt: string;
  city: number;
  skills: number[];
  orders: OrdersInfo;
  masterInfo: MasterInfo;
}

export interface ProfileState {
  data: Profile | null;
  isOwner: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updateError: string | null;
}

export interface UpdateUserPayload {
  surname?: string;
  name?: string;
  patronymic?: string;
  city?: number;
}

export type UpdateMasterInfoPayload = MasterInfo;

export type UpdateSkillsPayload = number[];
