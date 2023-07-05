import { keyStrokesProctoring, mouseProctoring } from "@/pages/exams/[answerSheetId]/[section2ASId]";
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
          `${API_URL}/answer/question/${answerId}`,
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

  updateAnswer: async (answerId: number, answerContent: string) => {
    let body = {
      content: answerContent,
    };

    try {
      const answerResponse = await fetch(`${API_URL}/answer/${answerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.load("token")}`,
        },
        body: JSON.stringify(body),
      });
      return answerResponse;
    } catch (error: any) {
      return error.response;
    }
  },

  updateLastAnswer: async (
    answerId: number,
    answerContent: string,
    keyboard: keyStrokesProctoring,
    mouse: mouseProctoring
  ) => {
    let body = {
      content: answerContent,
      keyboard: [keyboard],
      mouse: mouse,
    };

    try {
      const answerResponse = await fetch(
        `${API_URL}/answer/close-section/${answerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.load("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      return answerResponse;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default questionService;
