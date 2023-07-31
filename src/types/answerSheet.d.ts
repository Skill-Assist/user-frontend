import { Exam } from './exam';

export type AnswerSheet = {
  id: number;
  startDate: Date;
  endDate?: Date;
  deadline: Date;
  aiScore?: string;
  revisedScore?: string;
  __exam__?: Partial<Exam>;
};
