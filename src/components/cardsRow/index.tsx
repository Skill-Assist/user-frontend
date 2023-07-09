import { FC } from "react";
import { BsArrowDown } from "react-icons/bs";

import InvitationCard from "../invitationCard";

import { Invitation } from "@/types/invitation";

import styles from "./styles.module.scss";
import { ThreeDots } from "react-loader-spinner";

interface Props {
  title: string;
  loading: boolean;
  cards: Invitation[];
  open: boolean;
  index: number;
  placeholder: string;
  toggleRow: (index: number) => void;
  type?: "denied" | "expired" | null;
}

const cardsRow: FC<Props> = ({
  title,
  loading,
  cards,
  open,
  index,
  placeholder,
  toggleRow,
  type,
}: Props) => {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.divisor} onClick={() => toggleRow(index)}>
        <p>{title}</p>
        <hr />
        <BsArrowDown size={25} className={open ? styles.rotate : ""} />
      </div>
      <div className={`${styles.cards} ${open ? styles.open : ""}`}>
        {loading ? (
          <ThreeDots
            height="15"
            width="15"
            radius="9"
            color="var(--primary)!important"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        ) : cards.length > 0 ? (
          cards.map((invitation: Invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              denied={type === "denied" ? true : false}
              expired={type === "expired" ? true : false}
            />
          ))
        ) : (
          <p>{placeholder}</p>
        )}
      </div>
    </div>
  );
};

export default cardsRow;
