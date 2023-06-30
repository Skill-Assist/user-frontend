import { Exam } from "./exam";

type User = {
  id: number;
  name: string;
  email: string;
  __exams__: Partial<Exam[]>;
  answersCount: number;
};
