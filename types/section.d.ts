import { Exam } from "./exam";

export type Section = {
  id: number;
  name: string;
  description: string;
  durationInHours: number;
  isShuffleQuestions?: boolean;
  hasProctoring?: boolean;
  questionIds: string[];
  __exam__: Partial<Exam>;
  answerCount: number;
};
