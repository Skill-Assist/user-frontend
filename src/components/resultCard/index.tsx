import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Invitation } from '@/types/invitation';

import styles from './styles.module.scss';

type Props = {
  invitation: Invitation;
};

const ResultCard: FC<Props> = ({ invitation }: Props) => {
  const { examRef: exam } = invitation;
  const { createdByRef: company } = exam;

  const getLink = (): string => {
    if (exam.showScore === false) {
      return '#';
    } else if (exam.showScore === true && !exam.answerSheetsRef?.aiScore) {
      return '#';
    } else if (exam.showScore === true && exam.answerSheetsRef?.aiScore) {
      return `/reports/${exam.answerSheetsRef?.id}`;
    } else {
      return '#';
    }
  };

  return (
    <Link href={getLink()} className={styles.card}>
      <div className={styles.header}>
        <Image
          src={company.logo}
          width={400}
          height={400}
          alt="company photo"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h2>
            {exam.title} {exam.subtitle && exam.subtitle}{' '}
            {exam.level && exam.level}
          </h2>
          <span>{company.name}</span>
        </div>

        <div className={styles.info}>
          <p>
            {exam.showScore === false && 'Nota não disponível'}
            {exam.showScore === true &&
              !exam.answerSheetsRef?.aiScore &&
              'Nota não disponível ainda'}
            {exam.showScore === true &&
              exam.answerSheetsRef?.aiScore &&
              'Ver nota'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ResultCard;
