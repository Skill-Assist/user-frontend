import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

import styles from "./styles.module.scss";
import Image from "next/image";

type Props = {
  multiFiles?: boolean;
  requiredFiles?: string[];
};

const ChallengeQuestion: React.FC<Props> = ({ requiredFiles, multiFiles }: Props) => {
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
