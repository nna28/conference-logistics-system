import api from "../api/axios";

const workshopService = {
  getAll: async () => {
    const res = await api.get("/workshops/");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/workshops/${id}`);
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(`/workshops/${id}/overview`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/workshops/", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/workshops/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/workshops/${id}`);
    return res.data;
  },
};

export default workshopService;