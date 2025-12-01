// src/stores/useSignupFlowStore.ts
import { create } from "zustand";

interface SignupFlowState {
  email: string | null;
  setEmail: (email: string) => void;
  clear: () => void;
}

export const useSignupFlowStore = create<SignupFlowState>((set) => ({
  email: localStorage.getItem("signup_email") || null,
  setEmail: (email) => {
    localStorage.setItem("signup_email", email);
    set({ email });
  },
  clear: () => {
    localStorage.removeItem("signup_email");
    set({ email: null });
  },
}));