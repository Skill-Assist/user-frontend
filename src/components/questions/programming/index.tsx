import { FC } from "react";

import Editor from "@monaco-editor/react";

import styles from "./styles.module.scss";

type Props = {
  language?: string;
  onChange: Function
};

const ProgammingQuestion: FC<Props> = ({ language, onChange }: Props) => {
  return (
    <div className={styles.editor}>
      <Editor
        language={language || "javascript"}
        value="// Type javascript code here"
        onChange={(value) => onChange(value)}
        theme="vs-dark"
      />
    </div>
  );
};

export default ProgammingQuestion;
