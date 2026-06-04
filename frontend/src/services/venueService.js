import api from "../api/axios";

const venueService = {
  getAll: async (filters = {}) => {
    // 1. Lọc ra các tham số có giá trị hợp lệ (bỏ qua rỗng hoặc undefined)
    const validParams = {};
    if (filters.city) validParams.city = filters.city;
    if (filters.room_type) validParams.room_type = filters.room_type;
    if (filters.max_cost) validParams.max_cost = filters.max_cost;
    if (filters.min_capacity) validParams.min_capacity = filters.min_capacity;

    // 2. Truyền thẳng vào cấu hình 'params' của Axios
    // Axios sẽ tự động nối dấu ? nếu có tham số, và KHÔNG nối gì nếu params rỗng!
    const res = await api.get("/venues/", { params: validParams });
    
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