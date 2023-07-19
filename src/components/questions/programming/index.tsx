import { FC } from "react";

import Editor from "@monaco-editor/react";

import styles from "./styles.module.scss";

type Props = {
  language?: string;
  onChange: Function;
  defaultAnswer?: string;
};


const ProgammingQuestion: FC<Props> = ({
  language,
  onChange,
  defaultAnswer,
}: Props) => {
  return (
    <div className={styles.editor}>
      <Editor
        language={language || "javascript"}
        onChange={(value) => onChange(value)}
        theme="vs-dark"
        value={defaultAnswer}
      />
    </div>
  );
};

export default ProgammingQuestion;
