import { FormEvent, useRef, useState, FC } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import { BsArrowLeft } from "react-icons/bs";

import Card from "@/components/card";
import Button from "@/components/button";
import Modal from "@/components/modal";

import examService from "@/services/examService";

import styles from "./styles.module.scss";
import { Invitation } from "@/types/invitation";

interface Props {
  invitationData: Invitation;
  userData: User;
}

const Intro: FC<Props> = ({ invitationData, userData }: Props) => {
  const { examRef: examData } = invitationData;
  const [isAgree, setIsAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const checkInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    if(examData.answerSheetsRef){
      const response = await examService.startExam(examData.answerSheetsRef.id);

      router.push(`/exams/${response.id}`);
    }
  };

  let deadline = new Date(invitationData.createdAt);

  deadline.setSeconds(
    deadline.getSeconds() + examData.submissionInHours * 3600
  );

  let humanDeadline = deadline.toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <Card>
            <div className={styles.cardContainer}>
              <div className={styles.imgBx}>
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.contentBx}>
                <span>Olá, </span>
                <span className={styles.user}>{userData.name}</span>
                <h1>
                  {examData.title + "\n"}
                  {examData.subtitle && examData.subtitle + "\n"}
                  {examData.level && examData.level}
                </h1>
              </div>
              <div className={styles.testInfos}>
                <p>
                  Deadline: {humanDeadline}
                </p>
                <div>
                  {examData.durationInHours && (
                    <p>
                      Duração: {examData.durationInHours}{" "}
                      {examData.durationInHours > 1 ? "horas" : "hora"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.introContainer}>
          <div className={styles.back}>
            <BsArrowLeft
              fill="var(--primary)"
              size={35}
              onClick={() => router.back()}
            />
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.contentText}>
              <h1>Instruções</h1>
              <ol>
                <li>
                  Seu teste será cronometrado a partir do momento em que o teste
                  for iniciado.
                </li>
                <li>
                  Certifique-se de ter uma conexão de internet estável e um
                  local apropriado para o teste.
                </li>
                <li>
                  Siga as orientações de cada questão e baixe os materiais
                  necessários, se disponível.
                </li>
                <li>
                  O sistema não permitirá submissões após o término do tempo
                  disponível.
                </li>
                <li>
                  Após submeter seu teste, certifique-se de ter recebido o email
                  de confirmação.
                </li>
                <li>
                  Seus dados são encriptados para segurança e proteção das
                  informações.
                </li>
                <li>
                  Em caso de dificuldades técnicas, não deixe de acionar o
                  suporte.
                </li>
              </ol>
            </div>
            <form className={styles.form} onSubmit={submitHandler} id="intro">
              <div className={styles.field}>
                <input
                  onChange={() => {
                    setIsAgree(!isAgree);
                  }}
                  type="checkbox"
                  id="agree"
                  ref={checkInputRef}
                />
                <label htmlFor="agree">
                  Permito o acesso e monitoramento do teclado, mouse, câmera e
                  microfone do meu dispositivo durante a realização do teste.
                  Essas informações serão usadas apenas para garantir a
                  integridade do processo seletivo e será mantida de modo
                  confidencial e seguro, de acordo com a nossa Política de
                  Privacidade.
                </label>
              </div>

              <Button
                disabled={!isAgree}
                text="Iniciar teste"
                type="start"
                onClick={() => (showModal ? close() : open())}
              />
            </form>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={close}
            dimensions={{
              height: "200px",
              width: "600px",
            }}
          >
            <div className={styles.modalContainer}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <TailSpin
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              ) : (
                <>
                  <h1>Atenção!</h1>
                  <p>
                    Você não poderá voltar para esta página após finalizar o
                    teste. Deseja continuar?
                  </p>
                  <div className={styles.buttons}>
                    <Button
                      text="Cancelar"
                      type="cancel"
                      onClick={() => close()}
                    />
                    <Button
                      text="Iniciar teste"
                      type="start"
                      form="intro"
                      submit={true}
                    />
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Intro;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  const { answerSheetId } = ctx.params as { answerSheetId: string };

  const userResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/user/profile`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  
  const invitationResponse = userResponse.invitationsRef.find(
    (invitation: Invitation) => {
      if (invitation.examRef.answerSheetsRef){
        return invitation.examRef.answerSheetsRef.id === +answerSheetId;
      } else {
        return false
      }
    }
  );

  if(invitationResponse.examRef.answerSheetsRef.startDate){
    return {
      redirect: {
        destination: `/exams/${invitationResponse.examRef.answerSheetsRef.id}`,
        permanent: false,
      },
    };
  }



  return {
    props: {
      invitationData: invitationResponse,
      userData: userResponse,
    },
  };
};
