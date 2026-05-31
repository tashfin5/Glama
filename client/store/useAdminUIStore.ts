import { create } from 'zustand';

interface AdminUIState {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
}

export const useAdminUIStore = create<AdminUIState>()(
  (set) => ({
    pageTitle: null,
    setPageTitle: (title) => set({ pageTitle: title }),
  })
);
