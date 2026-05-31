import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  token: string;
  wishlist?: string[];
}

interface AuthState {
  userInfo: User | null;
  setCredentials: (user: User) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      setCredentials: (user) => set({ userInfo: user }),
      logout: () => set({ userInfo: null }),
    }),
    {
      name: 'admin-auth-storage', // name of item in the storage (must be unique)
    }
  )
);

// Note: The global axios interceptor in useAuthStore.ts already handles 401s 
// and redirects to /admin/login if the path starts with /admin.
// However, since we now have two stores, we should probably update the interceptor 
// to clear the admin store if the path is admin, and public store if public.
