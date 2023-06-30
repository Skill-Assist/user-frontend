import styles from "./styles.module.scss";

type Props = {
  children: React.ReactNode;
};

const Card: React.FC<Props> = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};

export default Card;
