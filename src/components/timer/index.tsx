import { FC, FormEvent } from "react";
import { useTimer } from "react-timer-hook";

import styles from "./styles.module.scss";

interface Props {
  expiryTimestamp: Date;
  onTimeIsOver?: (e: FormEvent<HTMLFormElement> | null) => void;
}

const Timer: FC<Props> = ({ expiryTimestamp, onTimeIsOver }: Props) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => onTimeIsOver ? onTimeIsOver(null) : null,
  });

  return (
    <>
      {days
        ? days +
          ` dia${days > 1 ? "s " : " "}` +
          " e " +
          hours  +
          ` hora${hours > 1 ? "s" : ""}`
        : null}

      {!days && seconds >= 0 && (
        <div className={styles.clockStyledTimer}>
            {
              hours != 0 
                ? hours <= 9 ? "0" + hours + ":" : hours + ":"
                : ""
            }
          <span>{minutes <= 9 ? "0" + minutes + ":" : minutes + ":"}</span>
          <span>
            {seconds <= 9 ? "0" + seconds : seconds === 0 ? "00" : seconds}
          </span>
        </div>
      )}
    </>
  );
};

export default Timer;
