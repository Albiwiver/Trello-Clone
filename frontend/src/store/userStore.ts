'use client'

import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


type State = {
  currentUser: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;   
  logout: () => void;           
};

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      setUser: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentUser: s.currentUser,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
