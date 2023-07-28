import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userService = {
  logout: () => {
    cookie.remove("token");
    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
  },
  
  getProfile: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default userService;
