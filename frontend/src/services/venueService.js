import api from "../api/axios";

const venueService = {
  getAll: async () => {
    const res = await api.get("/venues/");
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