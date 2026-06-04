import api from "../api/axios";

const venueService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.room_type) params.append("room_type", filters.room_type);
    if (filters.max_cost) params.append("max_cost", filters.max_cost);
    if (filters.min_capacity) params.append("min_capacity", filters.min_capacity);
    const res = await api.get(`/venues/?${params.toString()}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/venues/${id}`);
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(`/venues/${id}/overview`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/venues/", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/venues/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/venues/${id}`);
    return res.data;
  },
};

export default venueService;