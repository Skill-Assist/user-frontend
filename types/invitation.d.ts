import { Exam } from "./exam";

export type Invitation = {
  id: number,
  email: string,
  expirationInHours: number,
  accepted: boolean | null,
  createdAt: Date
  examRef: Exam,
  userRef: number
};
