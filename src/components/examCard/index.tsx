import { FC } from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Invitation } from "@/types/invitation";
import Timer from "../timer";

type Props = {
  invitation: Invitation;
};

const ExamCard: FC<Props> = ({ invitation }: Props) => {
  const { examRef: exam } = invitation;
  const { createdByRef: company } = exam;

  let humanExamDeadline;
  if (invitation.examRef.answerSheetsRef) {
    let examDeadline = new Date(invitation.examRef.answerSheetsRef?.deadline);

    humanExamDeadline = examDeadline.toLocaleString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  let submissionDeadline = new Date(invitation.inviteDate);

  submissionDeadline.setSeconds(
    submissionDeadline.getSeconds() +
      invitation.examRef.submissionInHours * 3600
  );

  let humanSubmissionDeadline = submissionDeadline.toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentDate = new Date();

  const diff = submissionDeadline.getTime() - currentDate.getTime();

  return (
    <Link
      href={
        diff > 0
          ? !exam.answerSheetsRef?.startDate
            ? `/exams/intro/${exam.answerSheetsRef?.id}`
            : exam.answerSheetsRef.startDate && !exam.answerSheetsRef.endDate
            ? `/exams/${exam.answerSheetsRef.id}`
            : `/results`
          : `/results`
      }
      className={styles.card}
    >
      <div className={styles.header} style={{ backgroundColor: company.color }}>
        <Image src={company.logo} width={400} height={400} alt="company name" />
      </div>
      <div className={styles.content}>
        <h2>
          {exam.title} {exam.subtitle && exam.subtitle}{" "}
          {exam.level && exam.level}
        </h2>

        <span>{exam.createdByRef.name}</span>

        <div className={styles.info}>
          {diff > 0 ? (
            !exam.answerSheetsRef?.startDate ? (
              <>
                <p>
                  Você tem até {humanSubmissionDeadline} para enviar suas
                  respostas
                </p>
              </>
            ) : exam.answerSheetsRef?.startDate &&
              !exam.answerSheetsRef.endDate ? (
              <>
                <p>Você tem até {humanExamDeadline} para finalizar seu teste</p>
              </>
            ) : (
              <>
                <p>Finalizado</p>
              </>
            )
          ) : (
            <>
              <p>Finalizado</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
