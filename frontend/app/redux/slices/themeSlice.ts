import { createSlice } from '@reduxjs/toolkit';

const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : "light";
const initialState = theme;

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;