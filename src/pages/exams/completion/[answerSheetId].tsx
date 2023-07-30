import { FC } from "react";
import { useLottie } from "lottie-react";
import { GetServerSideProps } from "next";

import Layout from "@/components/layout";

import Success from "@public/lottie/success.json";

import styles from "./styles.module.scss";
import Link from "next/link";

interface Props {
  showScore: boolean;
}

const CompletionPage: FC<Props> = ({ showScore }: Props) => {
  const options = {
    animationData: Success,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <Layout header sidebar sidebarClosed active={1}>
      <div className={styles.container}>
        <div className={styles.successContainer}>{View}</div>
        <h1>Meus parabéns, você concluiu o exame com sucesso!</h1>
        {showScore ? (
          <p>
            Seu exame foi enviado para correção, em breve você terá acesso a sua
            pontuação.
          </p>
        ) : (
          <p>
            Seu exame foi enviado para correção, aguarde um retorno do
            responsável.
          </p>
        )}
        <Link href={"/results"}>
          Ir para página de resultados
        </Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<any> => {
  const { token } = ctx.req.cookies;

  const { answerSheetId } = ctx.params as { answerSheetId: string };

  const answerSheetResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/answer-sheet/findOne?key=id&value=${answerSheetId}&relations=user,exam,sectionToAnswerSheets&map=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  return {
    props: {
      showScore: answerSheetResponse[0].__exam__.showScore,
    },
  };
};

export default CompletionPage;
