import { create } from "zustand";
import { defaultAvatar } from "../assets";

export const useStore = create((set) => ({
  avatar: defaultAvatar,
  updateAvatar: (newAvatar) => set({ avatar: newAvatar }),
}));
