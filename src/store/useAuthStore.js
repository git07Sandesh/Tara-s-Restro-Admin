import { create } from 'zustand'

const base_url = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: async (username, password) => {
    try {
      const res = await fetch(`${base_url}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      localStorage.setItem('admin_token', data.token);
      set({ token: data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Network error' };
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, isAuthenticated: false });
  },
}));