export type Exam = {
  id: number,
  title: string,
  subtitle: string,
  level: string,
  durationInHours: number,
  dateToArchive: Date,
  showScore: boolean,
  isPublic: boolean,
  status: "live" | "archived" | "draft",
};
