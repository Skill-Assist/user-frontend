import { FaHourglassHalf } from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import { AiFillUnlock, AiFillLock } from "react-icons/ai";

import styles from "./styles.module.scss";

interface Props {
  text: string;
  type: string;
  submit?: boolean;
  disabled?: boolean;
  form?: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({ text, type, onClick, submit, disabled, form }) => {
  return (
    <button
      form={form ? form : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${styles.button} 
        ${type === "start" && styles.start}
        ${type === "progress" && styles.progress}
        ${type === "edit" && styles.edit}
        ${type === "finished" && styles.finished}
        ${type === "solve" && styles.solve}
        ${disabled && styles.disabled}
      `}
      type={submit ? "submit" : "button"}
    >
      {text}
      {type === "progress" && <FaHourglassHalf size={20} />}
      {type === "edit" && <BiPencil size={20} />}
      {type === "solve" && <AiFillUnlock size={20} />}
      {type === "finished" && <AiFillLock size={20} />}
    </button>
  );
};

export default Button;
