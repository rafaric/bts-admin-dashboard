"use client";

import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  setSession: (session: Session | null) => void;
  setAdmin: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session:  null,
  user:     null,
  isAdmin:  false,
  setSession: (session) =>
    set({ session, user: session?.user ?? null }),
  setAdmin: (isAdmin) => set({ isAdmin }),
}));
