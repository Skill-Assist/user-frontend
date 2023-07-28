import { ChangeEvent, FC } from "react";

import styles from "./styles.module.scss";

interface Props {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  defaultAnswer: string;
}

const TextQuestion: FC<Props> = ({ onChange,defaultAnswer }) => {
  return (
    <form className={styles.formContainer}>
      <textarea
        onChange={onChange}
        name="answer"
        id="anwser"
        placeholder="Digite sua resposta aqui..."
        defaultValue={defaultAnswer}
      />
    </form>
  );
};

export default TextQuestion;
