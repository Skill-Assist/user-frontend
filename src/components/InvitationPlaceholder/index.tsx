import { useLottie } from "lottie-react";

import Card from "@public/lottie/card.json";

import styles from "./styles.module.scss";

const InvitationPlaceholder = () => {
  const options = {
    animationData: Card,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <p>
        Você ainda não possui nenhum convite. <br /> 
        Entre em contato com um recrutador ou <br />
        conheça nossos testes públicos
      </p>
      <div>{View}</div>
    </div>
  );
};

export default InvitationPlaceholder;
