import api from "../api/axios";

const contractService = {
  getAll: async () => {
    const res = await api.get("/contracts/");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/contracts/${id}`);
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(`/contracts/${id}/overview`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/contracts/", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/contracts/${id}`, data);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.put(`/contracts/${id}`, { status });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/contracts/${id}`);
    return res.data;
  },
};

export default contractService;