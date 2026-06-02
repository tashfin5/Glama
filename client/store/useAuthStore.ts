import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  token: string;
  wishlist?: string[];
  addresses?: {
    _id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    label: string;
    isDefault: boolean;
  }[];
}

interface AuthState {
  userInfo: User | null;
  setCredentials: (user: User) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      setCredentials: (user) => set({ userInfo: user }),
      logout: () => set({ userInfo: null }),
      toggleWishlist: async (productId) => {
        const state = get();
        if (!state.userInfo) return;
        try {
          const config = {
            headers: { Authorization: `Bearer ${state.userInfo.token}` },
          };
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/wishlist`, { productId }, config);
          set({
            userInfo: {
              ...state.userInfo,
              wishlist: data.wishlist
            }
          });
          if (data.wishlist.includes(productId)) {
            toast.success("Added to wishlist");
          } else {
            toast.success("Removed from wishlist");
          }
        } catch (error) {
          console.error('Failed to toggle wishlist:', error);
        }
      },
    }),
    {
      name: 'auth-storage', // name of item in the storage (must be unique)
    }
  )
);

import { useAdminAuthStore } from './useAdminAuthStore';

// Global Axios interceptor to handle 401 Unauthorized errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const isAdminPath = window.location.pathname.startsWith('/admin');
        if (isAdminPath) {
          useAdminAuthStore.getState().logout();
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
        } else {
          useAuthStore.getState().logout();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
