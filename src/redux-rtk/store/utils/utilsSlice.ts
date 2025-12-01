import { createSlice } from '@reduxjs/toolkit';

import { skillsMock } from '@/shared/data/skills';

import type { CategoryWithCount, Skill, Tag } from './types';
import { fetchCategories, fetchSkills, fetchTags } from './utilsThunks';

interface UtilsState {
  categories: CategoryWithCount[];
  tags: Tag[];
  skills: Skill[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UtilsState = {
  categories: [],
  tags: [],
  skills: skillsMock,
  status: 'idle',
  error: null,
};

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '�� 㤠���� ����㧨�� ��⥣�ਨ';
      })
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '�� 㤠���� ����㧨�� ⥣�';
      })
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.skills = skillsMock;
        state.error = action.error.message ?? 'Не удалось загрузить навыки, показаны мок-данные';
      });
  },
});

export default utilsSlice.reducer;
