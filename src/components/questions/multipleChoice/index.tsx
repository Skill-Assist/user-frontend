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
  selectedOption,
}: Props) => {
  if (!options) {
    return null;
  }

  return (
    <form className={styles.formContainer}>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={option.identifier}
            name="option"
            value={option.identifier}
            checked={selectedOption === option.identifier}
            onChange={onChange}
          />
          <label htmlFor={option.identifier}>{option.description}</label>
        </div>
      ))}
    </form>
  );
};

export default MultipleChoiceQuestion;
