import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
// ✅ Backend base URL from .env
const base_url = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000' // 👈 Dev backend
  : import.meta.env.VITE_API_BASE_URL; // 👈 Prod backend from .env

const { token } = useAuthStore.getState();
export const useMenuStore = create((set) => ({
  dishes: [],
  setDishes: (dishes) => set({ dishes }),

  createDish: async (formData) => {  
    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    try {
      const res = await fetch(`${base_url}/api/menu`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to create dish" };
      }

      set((state) => ({ dishes: [...state.dishes, data.data] }));
      return { success: true, message: "Dish added successfully" };
    } catch (error) {
      console.error("Error creating dish:", error);
      return { success: false, message: "Failed to create dish" };
    }
  },

  fetchDishes: async () => {
    if (!token) {
      console.error("Unauthorized. Please log in.");
      set({ dishes: [] });
      return;
    }
    try {

      const res = await fetch(`${base_url}/api/menu`);
      if (!res.ok) throw new Error("Failed to fetch dishes");
      const data = await res.json();
      set({ dishes: data.data });
    } catch (error) {
      console.error("Error fetching dishes:", error);
      set({ dishes: [] });
    }
  },

  deleteDish: async (dishId) => {
    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    const res = await fetch(`${base_url}/api/menu/${dishId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      dishes: state.dishes.filter((dish) => dish._id !== dishId)
    }));
    return { success: true, message: data.message };
  },

  updateDish: async (dishId, updatedDish) => {
    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    const res = await fetch(`${base_url}/api/menu/${dishId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: updatedDish
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      dishes: state.dishes.map((dish) => (dish._id === dishId ? data.data : dish))
    }));
    return { success: true, message: data.message };
  },

  toggleFeaturedDish: async (dishId, currentStatus) => {
    if (!token) {
      return alert("Unauthorized. Please log in.");
    }
    try {
      const res = await fetch(`${base_url}/api/menu/feature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ dishId, featured: !currentStatus }),
      });
      const data = await res.json();

      if(!data.success) return alert(data.message);
      set((state) => ({
        dishes: state.dishes.map((d) =>
          d._id === dishId ? { ...d, featured: data.data.featured } : d
        ),
      }));
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  },

  fetchFeatured: async () => {
    try {
      const res = await fetch(`${base_url}/api/menu/featured`);
      const data = await res.json();

      if (data.success) {
        return data.data;
      } else {
        console.error("Failed to fetch featured dishes:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching featured dishes:", error);
      return [];
    }
  }
}));
