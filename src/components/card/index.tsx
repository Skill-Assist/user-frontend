import { FC, ReactNode} from "react";

import styles from "./styles.module.scss";

type Props = {
  children: ReactNode;
};

const Card: FC<Props> = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};

export default Card;
