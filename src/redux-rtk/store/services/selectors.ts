import type { RootState } from '@/redux-rtk';

export const selectServicesState = (state: RootState) => state.services;
