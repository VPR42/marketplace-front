import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createService,
  deleteService,
  fetchServiceById,
  fetchServices,
  updateService,
} from './servicesThunks';
import type { Service, ServicesState } from './types';

const initialState: ServicesState = {
  items: [],

  totalPages: 0,

  totalElements: 0,

  page: 0,

  size: 0,

  currentService: null,

  status: 'idle',

  error: null,
};

const servicesSlice = createSlice({
  name: 'services',

  initialState,

  reducers: {
    setCurrentService(state, action: PayloadAction<Service | null>) {
      state.currentService = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';

        state.error = null;

        state.items = [];

        state.totalPages = 0;

        state.totalElements = 0;
      })

      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = action.payload.content;

        state.totalPages = action.payload.totalPages;

        state.totalElements = action.payload.totalElements;

        state.page = action.payload.number;

        state.size = action.payload.size;
      })

      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload ?? action.error.message ?? 'Не удалось загрузить услуги';

        state.items = [];

        state.totalPages = 0;

        state.totalElements = 0;
      })

      .addCase(fetchServiceById.pending, (state) => {
        state.status = 'loading';

        state.error = null;
      })

      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.currentService = action.payload;
      })

      .addCase(fetchServiceById.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload ?? action.error.message ?? 'Не удалось загрузить услугу';
      })

      .addCase(createService.pending, (state) => {
        state.status = 'loading';

        state.error = null;
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = [action.payload, ...state.items];

        state.totalElements += 1;
      })

      .addCase(createService.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload ?? action.error.message ?? 'Не удалось создать услугу';
      })

      .addCase(updateService.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );

        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
      })

      .addCase(updateService.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload ?? action.error.message ?? 'Не удалось обновить услугу';
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = state.items.filter((item) => item.id !== action.meta.arg);

        state.totalElements = Math.max(0, state.totalElements - 1);

        if (state.currentService?.id === action.meta.arg) {
          state.currentService = null;
        }
      })

      .addCase(deleteService.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload ?? action.error.message ?? 'Не удалось удалить услугу';
      });
  },
});

export const { setCurrentService } = servicesSlice.actions;

export default servicesSlice.reducer;
