import { ChangeEvent, FC } from "react";

import { Option } from "@/types/option";

import styles from "./styles.module.scss";

interface Props {
  options: Option | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedOption: string;
}

const MultipleChoiceQuestion: FC<Props> = ({
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
