import api from "../api/axios";

const auditLogService = {
  getAll: async () => {
    const res = await api.get(
      "/audit-logs/"
    );

    return res.data;
  },
};

export default auditLogService;