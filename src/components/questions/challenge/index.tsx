import { useState, FC } from "react";
import Image from "next/image";

import styles from "./styles.module.scss";

type Props = {
  multiFiles?: boolean;
  requiredFiles?: string[];
};

const ChallengeQuestion: FC<Props> = ({ requiredFiles, multiFiles }: Props) => {
  const [data, setData] = useState<any>()

  return (
    <div className={styles.container}>
      {requiredFiles && (
        <div className={styles.files}>
          <span className={styles.title}>Baixe os seguintes arquivos necessários:</span>
          {
            requiredFiles.map((file, index) => {
              return <a className={styles.requiredFile} href={file} key={index} download>
                <Image src="/icons/download.svg" alt="download icon" width={20} height={20} />
                <span>{file}</span>
              </a>
            })
          }
        </div>
      )}
      <div className={styles.upload}>
        <input id="file-upload" type="file" multiple={true} onChange={(e) => setData(e.target.files)} />
        {
          data && data.length > 0 ? <label htmlFor="file-upload" className={styles.uploaded}>{data[0].name}</label> : <label htmlFor="file-upload">Upload File</label>
        }
      </div>
    </div>
  );
};

export default ChallengeQuestion;
