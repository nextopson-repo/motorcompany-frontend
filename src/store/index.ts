import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

// Hydrate auth state from localStorage on app start
function getPreloadedState() {
  try {
    const rawUser = localStorage.getItem('user');
    const sessionToken = localStorage.getItem('sessionToken') || localStorage.getItem('authToken');
    if (rawUser && sessionToken) {
      const user = JSON.parse(rawUser);
      return {
        users: [],
        vehicles: [],
        currentUser: user,
        isAuthenticated: true,
      } as const;
    }
  } catch {
    // ignore parse errors and fall back to default
  }
  return undefined;
}

export const store = configureStore({
  reducer: appReducer,
  preloadedState: getPreloadedState() as any,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


