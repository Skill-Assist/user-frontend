import { useState } from "react";

import styles from "./styles.module.scss";
import { Option } from "@/types/option";

interface Props {
  options: Option | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOption: string;
}

const MultipleChoiceQuestion: React.FC<Props> = ({
  options,
  onChange,
  selectedOption
}: Props) => {
  if (!options) {
    return null;
  }

  return (
    <form className={styles.formContainer}>
      {Object.entries(options).map(([key, value]) => (
        <div key={key}>
          <input
            type="radio"
            id={key}
            name="option"
            value={key}
            checked={selectedOption === key}
            onChange={onChange}
          />
          <label htmlFor={key}>{value}</label>
        </div>
      ))}
    </form>
  );
};

export default MultipleChoiceQuestion;
