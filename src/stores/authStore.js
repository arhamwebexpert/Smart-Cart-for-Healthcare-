// src/stores/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: (userData, token) =>
    set({
      isAuthenticated: true,
      user: userData,
      token,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    }),

  updateUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData },
    })),
}));

export default useAuthStore;
