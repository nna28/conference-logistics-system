import api from "../api/axios";

const materialShipmentService = {
  getAll: async () => {
    const res = await api.get(
      "/material-shipments/"
    );
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(
      `/material-shipments/${id}`
    );
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(
      `/material-shipments/${id}/overview`
    );
    return res.data;
  },

  create: async (data) => {
    const res = await api.post(
      "/material-shipments/",
      data
    );
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(
      `/material-shipments/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(
      `/material-shipments/${id}`
    );
    return res.data;
  },
};

export default materialShipmentService;