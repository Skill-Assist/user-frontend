import { Invitation } from '@/types/invitation';
import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const examService = {
  getExams: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);

      const exams = profile.data.invitationsRef.filter(
        (invitation: Invitation) => invitation.accepted === true
      );

      return exams;
    } catch (error: any) {
      return error.response;
    }
  },

  getInvitations: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data.invitationsRef;
    } catch (error: any) {
      return error.response;
    }
  },

  getAnswerSheet: async (AnswerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/findOne?key=id&value=${AnswerSheetId}&relations=exam,sectionToAnswerSheets,user&map=true`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes("Invalid token")) {
        cookie.remove("token");
        toast.error("Erro de conexão. Verifique sua internet e tente novamente...", {
          icon: "📶",
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  acceptInvitation: async (invitationId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/user/acceptInvitation?invitationId=${invitationId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error('Erro de conexão. Verifique sua internet e tente novamente...', {
          icon: '📶',
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  denyInvitation: async (invitationId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/user/rejectInvitation?invitationId=${invitationId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error('Erro de conexão. Verifique sua internet e tente novamente...', {
          icon: '📶',
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  startExam: async (answerSheetId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/start?id=${answerSheetId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error('Erro de conexão. Verifique sua internet e tente novamente...', {
          icon: '📶',
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  submitExam: async (answerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/submit?id=${answerSheetId}`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  startSection: async (sectionId: number, answerSheetId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/section-to-answer-sheet/batch-answer?sectionId=${sectionId}&answerSheetId=${answerSheetId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookie.load('token')}`,
          },
        }
      ).then((res) => res.json());

      return response;

    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error('Erro de conexão. Verifique sua internet e tente novamente...', {
          icon: '📶',
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },
};

export default examService;
