import { FC } from 'react';
import { useLottie } from 'lottie-react';

import ComputerMan from '@public/lottie/computer-man.json';

import styles from './styles.module.scss';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
  link?: string;
}

const Placeholder: FC<Props> = ({
  title,
  subtitle,
  link,
  buttonText,
}: Props) => {
  const options = {
    animationData: ComputerMan,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link
          href={link ? link : '#'}
          onClick={() => {
            if (!link) {
              toast.loading('Feature em desenvolvimento', {
                duration: 3000,
                position: 'top-right',
              });
            }
          }}
          className={styles.button}
        >
          {buttonText}
        </Link>
      </div>
      <div className={styles.view}>{View}</div>
    </div>
  );
};

export default Placeholder;
