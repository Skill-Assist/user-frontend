import { Invitation } from "@/types/invitation";
import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const examService = {
  getExams: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);

      const exams = profile.data.invitationsRef.filter((invitation: Invitation) => invitation.accepted === true);

      return exams;
    } catch (error: any) {
      return error.response;
    }
  },

  getInvitations: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data.invitationsRef;
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

  denyInvitation: async (invitationId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await fetch(`${API_URL}/user/rejectInvitation?invitationId=${invitationId}`, {
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
      const response = await fetch(`${API_URL}/answer-sheet/submit/?id=${answerSheetId}`, {
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
