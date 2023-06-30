import axios from "axios";
import cookie from "react-cookies";

const API_URL = "http://localhost:5500/api/v1";

const userService = {
  signin: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password,
      });

      cookie.save("token", response.data.access_token, {});
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  getProfile: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default userService;
