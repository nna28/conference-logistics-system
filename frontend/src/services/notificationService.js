import api from "../api/axios";

const notificationService = {
  getAll: async () => {
    const res = await api.get(
      "/notifications/"
    );

    return res.data;
  },

  getByUser: async (userId) => {
    const res = await api.get(
      `/notifications/user/${userId}`
    );

    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(
      `/notifications/${id}/read`
    );

    return res.data;
  },
};

export default notificationService;