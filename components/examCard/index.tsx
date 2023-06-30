import React from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Exam } from "@/types/exam";

type Company = {
  name: string;
  color: string;
  logo: string;
};

type Props = {
  company: Company;
  exam: Exam;
};

let examLeftTime: string = "";

const ExamCard: React.FC<Props> = ({ company, exam }: Props) => {
  // if (exam.deadline) {
  //   const deadlineDate = new Date(exam.deadline);
  //   const currentDate = new Date();

  //   const diff = deadlineDate.getTime() - currentDate.getTime();

  //   const diffInHours = Math.floor(diff / (1000 * 3600));

  //   if (diffInHours > 24) {
  //     const diffInDays = Math.floor(diff / (1000 * 3600 * 24));
  //     examLeftTime = `${diffInDays}`
  //   } else {
  //     examLeftTime = `${diffInHours}`;
  //   }
  // } else if (exam.durationInHours && !exam.deadline) {
  //   examLeftTime = `${exam.durationInHours} horas`;
  // }

  return (
    <Link href={`/exams/intro/${exam.id}`} className={styles.card}>
      <div className={styles.header} style={{ backgroundColor: company.color }}>
        <Image
          className={styles.logo}
          src={company.logo}
          width={400}
          height={400}
          alt="company name"
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {exam.title} {exam.subtitle && exam.subtitle}{" "}
          {exam.level && exam.level}
        </h2>

        <span className={styles.company}>exam.owner</span>

        <div className={styles.info}>
          <p className="status">Não iniciado</p>
          <p className={styles.deadline}>Restam {examLeftTime} dias</p>
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
