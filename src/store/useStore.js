import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAvatar } from "../assets";

export const useStore = create(
  persist(
    (set) => ({
      darkmode: false,
      avatar: defaultAvatar,
      toggleDarkmode: () => set((state) => ({ darkmode: !state.darkmode })),
      setAvatar: (newAvatar) => set({ avatar: newAvatar }),
    }),
    {
      partialize: (state) => ({
        darkmode: state.darkmode,
      }),
    },
  ),
);
