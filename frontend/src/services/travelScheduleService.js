import api from "../api/axios";

const travelScheduleService = {
  getAll: async () => {
    const res = await api.get("/travel-schedules/");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/travel-schedules/${id}`);
    return res.data;
  },

  getOverview: async (id) => {
    const res = await api.get(
      `/travel-schedules/${id}/overview`
    );
    return res.data;
  },

  create: async (data) => {
    const res = await api.post(
      "/travel-schedules/",
      data
    );
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(
      `/travel-schedules/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(
      `/travel-schedules/${id}`
    );
    return res.data;
  },
};

export default travelScheduleService;