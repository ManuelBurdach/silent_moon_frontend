import { create } from "zustand";

export const userState = create((set) => ({
  user: {
    id: 0,
    email: false,
    firstName: "guest",
    isLoggedIn: false,
  },
  setUser: (user) => set((state) => ({ user })),
}));
