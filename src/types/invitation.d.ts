import { Exam } from "./exam";

export type Invitation = {
  id: number,
  email: string,
  expirationInHours: number,
  accepted: boolean | null,
  inviteDate: Date
  examRef: Exam,
  userRef: number
};
