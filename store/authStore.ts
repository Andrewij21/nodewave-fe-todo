import { create } from "zustand";
import type { User } from "@/schemas/userSchema";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user: user }),

  initializeAuth: () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const item = window.localStorage.getItem("userSession");
      if (item) {
        set({ user: JSON.parse(item) as User });
      }
    } catch (error) {
      console.warn("Error parsing user from localStorage", error);
      window.localStorage.removeItem("userSession");
    } finally {
      set({ loading: false });
    }
  },
}));
