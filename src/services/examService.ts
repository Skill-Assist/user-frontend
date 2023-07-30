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
        toast.error('Sua sessão expirou. Faça login novamente', {
          icon: '⏱️',
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
        toast.error('Sua sessão expirou. Faça login novamente', {
          icon: '⏱️',
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
        toast.error('Sua sessão expirou. Faça login novamente', {
          icon: '⏱️',
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
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/section-to-answer-sheet/batch-answer?sectionId=${sectionId}&answerSheetId=${answerSheetId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error('Sua sessão expirou. Faça login novamente', {
          icon: '⏱️',
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }

      console.log(error)

      return error.response;
    }
  },
};

export default examService;
