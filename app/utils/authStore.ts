import { create } from "zustand";
interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));

