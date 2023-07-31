import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const answerSheetService = {
  getAnswerSheet: async (answerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/findOne?key=id&value=${answerSheetId}&relations=user,exam,sectionToAnswerSheets&map=true`,
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

  getOwnAnswerSheet: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/fetchOwn?relations=exam&map=true`,
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

  getSectionsFromAnswerSheet: async (answerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/fetchSections?id=${answerSheetId}`,
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
};

export default answerSheetService;
