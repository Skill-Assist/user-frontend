import { FC, useEffect, useState } from "react";

import { FaHourglassHalf } from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import { AiFillUnlock, AiFillLock } from "react-icons/ai";

import styles from "./styles.module.scss";

interface Props {
  text: string | Promise<string>;
  type: string | Promise<string>;
  submit?: boolean;
  disabled?: boolean;
  form?: string;
  onClick?: () => void;
}

const Button: FC<Props> = ({ text, type, onClick, submit, disabled, form }) => {
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonType, setButtonType] = useState<string>("");

  useEffect(() => {
    if (typeof text === "string") {
      setButtonText(text);
    } else if (typeof text === "object" && typeof text.then === "function") {
      text.then((resolvedText) => setButtonText(resolvedText));
    }
  }, [text]);

  useEffect(() => {
    if (typeof type === "string") {
      setButtonType(type);
    } else if (typeof type === "object" && typeof type.then === "function") {
      type.then((resolvedType) => setButtonType(resolvedType));
    }
  }, [type]);

  return (
    <button
      form={form ? form : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${styles.button} 
        ${buttonType === "start" && styles.start}
        ${buttonType === "progress" && styles.progress}
        ${buttonType === "edit" && styles.edit}
        ${buttonType === "finished" && styles.finished}
        ${buttonType === "solve" && styles.solve}
        ${disabled && styles.disabled}
      `}
      type={submit ? "submit" : "button"}
    >
      {buttonText}
      {type === "progress" && <FaHourglassHalf size={20} />}
      {type === "edit" && <BiPencil size={20} />}
      {type === "solve" && <AiFillUnlock size={20} />}
      {type === "finished" && <AiFillLock size={20} />}
    </button>
  );
};

export default Button;
