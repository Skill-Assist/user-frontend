import { Section } from "./section";
import { User } from "./user";

export type Exam = {
  id: number,
  title: string,
  subtitle: string,
  level: string,
  durationInHours: number,
  submissionDeadlineInHours: number,
  dateToArchive: Date,
  showScore: boolean,
  isPublic: boolean,
  status: "live" | "archived" | "draft",
  __createdBy__?: User
  __sections__?: Section[]
};
