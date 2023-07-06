import Layout from "@/components/layout";
import React, { FC } from "react";
import styles from "./styles.module.scss";

import RocketImage from "/public/images/home/rocket.png";
import AutomationImage from "/public/images/home/automation.png";
import ProctoringImage from "/public/images/home/proctoring.png";
import PlugAndPlayImage from "/public/images/home/plug-and-play.png";
import CurveImage from "/public/images/home/curva.png";
import IAImage from "/public/images/home/ai.png";
import Image from "next/image";
import { GetServerSideProps } from "next";

interface Props {
  user: User;
}

const Home: FC<Props> = ({ user }: Props) => {
  const content = [
    {
      image: AutomationImage,
      title: "Automatização",
      text: "Crie testes com avaliação automatizada e em tempo real de seus candidatos, aumentando a produtividade dos seus processos seletivos.",
    },
    {
      image: ProctoringImage,
      title: "Proctoring",
      text: "Seja capaz de monitorar seus candidatos durante os testes, garantindo uma avaliação adequada e sem fraudes.",
    },
    {
      image: PlugAndPlayImage,
      title: "Plug-and-play",
      text: "Use nosso diversificado banco de questões e testes, customizando de acordo com suas necessidades.",
    },
    {
      image: CurveImage,
      title: 'Notas "na curva"',
      text: "Utilize nossa avaliação cruzada para obter melhores resultados, comparando a performance dos candidatos com outros que realizaram testes semelhantes.",
    },
    {
      image: IAImage,
      title: "Correção baseada em AI",
      text: "Seja capaz de avaliar todos os candidatos de forma rápida e efetiva, garantimos relatórios detalhados e insights personalizados por candidato.",
    },
    {
      image: RocketImage,
      title: "Escala do processo",
      text: "Garanta processos seletivos justos e eficazes, baseado nas habilidades e performances dos candidatos, eliminando viéses.",
    },
  ];

  return (
    <Layout sidebar footer active={0}>
      <div>
        <div className={styles.container}>
          <h2>
            Boas vindas, <b className={styles.user}>{user.name}!</b>
          </h2>
          <div className={styles.content}>
            <p>Estamos felizes por termos você conosco!</p>

            <p>
              <b>Navegue</b> pelas <b>áreas da plataforma</b> para conhecer mais
              e, em caso de dúvidas, nos contate <b>via suporte.</b>
            </p>

            <p>
              Desejamos uma <b>ótima experiência</b> para você!
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title}>Áreas da plataforma</h2>

            <div className={styles.cards}>
              {content.map((card, index) => {
                return (
                  <div className={styles.card} key={index}>
                    <div className={styles.imageContainer}>
                      <div className={styles.image}>
                        <Image
                          src={card.image}
                          width={0}
                          height={0}
                          alt="Card image"
                        />
                      </div>
                    </div>
                    <div className={styles.content}>
                      <h4 className={styles.title}>{card.title}</h4>
                      <span className={styles.text}>{card.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { token } = req.cookies;

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const user = await userResponse.json();

  return {
    props: {
      user,
    },
  };
};

export default Home;
