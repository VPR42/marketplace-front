import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type activePageType = number | null;
interface activePageState {
  activePage: activePageType;
}

const initialState: activePageState = {
  activePage: null,
};

const activePageSlice = createSlice({
  name: 'activePage',
  initialState,
  reducers: {
    changeActivePage(
      state: activePageState,
      action: PayloadAction<{ activePage: activePageType }>,
    ) {
      state.activePage = action.payload.activePage;
    },
  },
});

export const { changeActivePage } = activePageSlice.actions;

export default activePageSlice.reducer;
