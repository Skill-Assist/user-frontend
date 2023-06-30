import { Exam } from "./exam";

export type Invitation = {
  id: number,
  email: string,
  expirationInHours: number,
  accepted: boolean,
  examRef: Exam,
  userRef: number
};
