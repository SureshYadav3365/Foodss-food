import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    searchQuery: '',
    filters: { isVeg: null, sort: '', cuisine: '', category: '' },
    sidebarOpen: false,
    theme: localStorage.getItem('theme') || 'light',
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { isVeg: null, sort: '', cuisine: '', category: '' }; state.searchQuery = ''; },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    },
  },
});

export const { setSearchQuery, setFilters, clearFilters, toggleSidebar, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
