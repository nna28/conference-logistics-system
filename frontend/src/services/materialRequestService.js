import api from "../api/axios";

const materialRequestService = {
  getAll: async () => {
    const res = await api.get("/material-requests/");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/material-requests/${id}`);
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(`/material-requests/${id}/overview`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/material-requests/", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/material-requests/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/material-requests/${id}`);
    return res.data;
  },

  // ✅ THÊM HÀM MỚI VÀO ĐÂY:
  notifyCompletion: async (id) => {
    const res = await api.post(`/material-requests/${id}/notify-completion`);
    return res.data;
  },
};

export default materialRequestService;