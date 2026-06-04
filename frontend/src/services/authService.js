import api from "../api/axios";

const authService = {
  login: async (username, password) => {
    const res = await api.post(
      "/auth/login",
      {
        username,
        password,
      }
    );

    return res.data;
  },
};

export default authService;