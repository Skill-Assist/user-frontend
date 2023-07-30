import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const sectionToAnswerSheetService = {
  getSectionToAnswerSheetService: async (section2ASId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/section-to-answer-sheet/findOne?key=id&value=${section2ASId}&relations=answers,section&map=true`,
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

export default sectionToAnswerSheetService;
