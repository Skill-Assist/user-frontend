import { useState, useEffect, FC } from "react";

import styles from "./styles.module.scss";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextQuestion: FC<Props> = ({ onChange }) => {
  return (
    <form className={styles.formContainer}>
      <textarea
        onChange={onChange}
        name="answer"
        id="anwser"
        placeholder="Digite sua resposta aqui..."
      />
    </form>
  );
};

export default TextQuestion;
