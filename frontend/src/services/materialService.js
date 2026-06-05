import api from "../api/axios";

const materialService = {
  getAll: async () => {
    const res = await api.get("/materials/");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/materials/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/materials/", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/materials/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/materials/${id}`);
    return res.data;
  },
};

export default materialService;