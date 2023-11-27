import { create } from "zustand";

type userState = {
  userId: string;
  setId: (id: string) => void;
};

export const useUserStore = create<userState>()((set) => ({
  userId: "",
  setId: (id) => set({ userId: id }),
}));
