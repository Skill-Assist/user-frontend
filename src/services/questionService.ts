import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const questionService = {
  getQuestions: async (answersId: number[]) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const answerRequests = answersId.map(async (answerId) => {
        const answerResponse = await axios.get(
          `${API_URL}/answer/getQuestion?id=${answerId}`,
          config
        );
        return answerResponse.data;
      });

      const answersResponse = await Promise.all(answerRequests);
      return answersResponse;
    } catch (error: any) {
      return error.response;
    }
  },

  getAnswer: async (answerId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer/findOne?key=id&value=${answerId}`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  updateAnswer: async (answerId: number, answerContent: string) => {
    let body = {
      content: answerContent,
    };

    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };

    try {
      const answerResponse = await axios.patch(
        `${API_URL}/answer/submit?id=${answerId}`,
        body,
        config
      );
      
      console.log("udpate answer response", answerResponse)

      return answerResponse;
    } catch (error: any) {
      console.log("udpate answer error", error)
      return error;
    }
  },

  updateLastAnswer: async (
    answerId: number,
    answerContent: string,
    keyboard: string,
    mouse: string
  ) => {
    let body = {
      content: answerContent,
      keyboard,
      mouse,
    };

    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };

    try {
      const answerResponse = await axios.patch(
        `${API_URL}/answer/submitAndCloseSection?id=${answerId}`,
        body,
        config
      );
      return answerResponse;
    } catch (error: any) {
      return error.response;
    }
  },

  updateFileAnswer: async (answerId: number, answerBody: FormData) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };

    console.log("update file answer body", answerBody)

    try {
      const response = await axios.patch(
        `${API_URL}/answer/submit?id=${answerId}`,
        answerBody,
        config
      );

      console.log("update file answer response", response)

      return response;
    } catch (error: any) {
      console.log("update file answer error", error)

      return error;
    }
  },

  updateLastFileAnswer: async (answerId: number, answerBody: FormData) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.patch(
        `${API_URL}/answer/submitAndCloseSection?id=${answerId}`,
        answerBody,
        config
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },
};

export default questionService;
