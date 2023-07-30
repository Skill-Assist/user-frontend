import { useState, FC, ChangeEvent } from 'react';
import Image from 'next/image';

import styles from './styles.module.scss';
import { AiOutlineCloudDownload } from 'react-icons/ai';

type Props = {
  handleChallengeAnswerChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileAnswer: File | undefined;
  requiredFiles?: string[];
};

const ChallengeQuestion: FC<Props> = ({
  requiredFiles,
  handleChallengeAnswerChange,
  fileAnswer,
}: Props) => {
  return (
    <div className={styles.container}>
      {requiredFiles && (
        <div className={styles.files}>
          <span className={styles.title}>
            Baixe os seguintes arquivos necessários:
          </span>
          {requiredFiles.map((file, index) => {
            return (
              <a
                className={styles.requiredFile}
                href={file}
                key={index}
                download
              >
                <AiOutlineCloudDownload
                  fill="var(--secondary-2)"
                  size={20}
                  style={{ cursor: 'pointer' }}
                />
                <span>{file}</span>
              </a>
            );
          })}
        </div>
      )}
      <div className={styles.upload}>
        <input
          id="file-upload"
          type="file"
          accept=".zip"
          onChange={handleChallengeAnswerChange}
        />
        {fileAnswer ? (
          <label htmlFor="file-upload" className={styles.uploaded}>
            {fileAnswer.name}
          </label>
        ) : (
          <label htmlFor="file-upload">Upload File</label>
        )}
      </div>
    </div>
  );
};

export default ChallengeQuestion;
