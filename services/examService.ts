import axios from "axios";
import cookie from "react-cookies";

const API_URL = "http://localhost:5500/api/v1";

const examService = {
  getExams: async (examsId: number[]) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const examsRequests = examsId.map(async (examsId) => {
        const examResponse = await axios.get(
          `${API_URL}/exam/findOne?key=id&value=${examsId}&relations=createdBy&map=true`,
          config
        );
        return examResponse.data;
      });

      const examsResponse = await Promise.all(examsRequests);
      return examsResponse;
    } catch (error: any) {
      return error.response;
    }
  },

  getInvitations: async (invitationsId: number[]) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const invitationsRequests = invitationsId.map(async (invitationId) => {
        const invitationResponse = await axios.get(
          `${API_URL}/examInvitation?key=id&value=${invitationId}&relations=exam,user`,
          config
        ).then((res) => res.data);
        return invitationResponse;
      }
      );
      
      
      const invitationResponse = await Promise.all(invitationsRequests);
      return invitationResponse;
    } catch (error: any) {
      return error.response;
    }
  },

  acceptInvitation: async (invitationId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await fetch(`${API_URL}/user/acceptInvitation?invitationId=${invitationId}`, {
        method: "GET",
        headers: config.headers,
      }).then((res) => res.json());
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  startExam: async (examId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await fetch(`${API_URL}/answer-sheet?examId=${examId}`, {
        method: "POST",
        headers: config.headers,
      }).then((res) => res.json());
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  submitExam: async (answerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await fetch(`${API_URL}/answer-sheet/submit/${answerSheetId}`, {
        method: "PATCH",
        headers: config.headers,
      }).then((res) => res.json());
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  startSection: async (sectionId: number, answerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await fetch(
        `${API_URL}/section-to-answer-sheet/batch-answer?sectionId=${sectionId}&answerSheetId=${answerSheetId}`,
        {
          method: "POST",
          headers: config.headers,
        }
      ).then((res) => res.json());
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default examService;
