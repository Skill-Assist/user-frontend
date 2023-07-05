import { GetServerSideProps } from "next";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import { FaHourglassHalf } from "react-icons/fa";

import Modal from "@/components/modal";
import Layout from "@/components/layout";
import Card from "@/components/card";
import Button from "@/components/button";

import { Section } from "@/types/section";
import { Section2AS } from "@/types/section2AS";

import examService from "@/services/examService";

import styles from "./styles.module.scss";
import Timer from "@/components/timer";

interface Props {
  sectionsData: Section[];
  sectionToAnswerSheets: Section2AS[];
  examLeftTimeInSeconds: number;
  user: any;
}

const ExamPage: FC<Props> = ({
  sectionsData,
  sectionToAnswerSheets,
  examLeftTimeInSeconds
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  let examLeftTime: Date = new Date();

  if (examLeftTimeInSeconds) {
    examLeftTime.setSeconds(examLeftTime.getSeconds() + examLeftTimeInSeconds);
  }

  const startSectionHandler = async (sectionId: number) => {
    setLoading(true);
    const response = await examService.startSection(
      sectionId,
      router.query.answerSheetId as string
    );

    const section2ASId = response.id;

    router.push(`/exams/${router.query.answerSheetId}/${section2ASId}`);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement> | null) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);
    await examService
      .submitExam(router.query.answerSheetId as string)
      .then(() => {
        router.push(`/exams`);
      });
  };

  return (
    <>
      <Layout
        sidebar
        disabledSidebar
        header
        footer
        active={1}
        headerTitle="Seu Exame"
      >
        <div className={styles.content}>
          <header className={styles.header}>
            <h3>Etapas</h3>
            <p>
              <FaHourglassHalf /> Tempo restante para o teste:{" "}
              <Timer
                expiryTimestamp={examLeftTime}
                onTimeIsOver={submitHandler}
              />
            </p>
          </header>

          <form
            className={styles.sectionsContainer}
            onSubmit={submitHandler}
            id="exam"
          >
            {sectionsData.map((section, index) => (
              <div className={styles.cardWrapper}>
                <Card key={index}>
                  <div className={styles.cardContent}>
                    <div className={styles.infosContainer}>
                      <h1>{index + 1}</h1>
                      <div className={styles.infos}>
                        <h3>{section.name}</h3>
                        <p>{section.description}</p>
                      </div>
                    </div>
                    <div className={styles.buttonsContainer}>
                      <Button
                        text={
                          sectionToAnswerSheets.length === 0 
                            ? "Resolver"
                            : sectionToAnswerSheets[index]?.endDate 
                              ? "Finalizado" 
                              : "Resolver"
                        }
                        type={
                          sectionToAnswerSheets.length === 0 
                            ? "solve" 
                            : sectionToAnswerSheets[index]?.endDate 
                              ? "finished" 
                              : "solve"
                        }
                        onClick={sectionToAnswerSheets[index]?.endDate ? () => {} : () => startSectionHandler(section.id)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            <div className={styles.actions}>
              <button
                onClick={() => {
                  open();
                }}
                type="button"
              >
                Finalizar teste
              </button>
            </div>
          </form>
        </div>
      </Layout>
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
                <>
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
                          onClick={() => {
                            close();
                          }}
                        />
                        <Button
                          text="Finalizar teste"
                          type="start"
                          form="exam"
                          submit={true}
                        />
                      </div>
                    </>
                  )}
                </>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExamPage;

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<any> => {
  const { token } = ctx.req.cookies;

  const { answerSheetId } = ctx.params as { answerSheetId: string };

  const answerSheetResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/answer-sheet/findOne?key=id&value=${answerSheetId}&relations=user,exam,sectionToAnswerSheets&map=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());
 
  const sectionsResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/answer-sheet/findOneWithSections?id=${answerSheetId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  const termData = {
    startDate: answerSheetResponse.startDate,
    durationInHours: answerSheetResponse.__exam__.durationInHours
        
  };

  const startExamDate = new Date(termData.startDate);
  const currentDate = new Date();

  const timeSpent = Math.floor(
    (currentDate.getTime() - startExamDate.getTime()) / 1000
  );

  const diff = termData.durationInHours * 3600 - timeSpent;

  if (diff <= 0) {
    return {
      redirect: {
        destination: "/exams",
        permanent: false,
      },
    };
  }

  const sectionToAnswerSheets = answerSheetResponse.__sectionToAnswerSheets__

  return {
    props: {
      sectionsData: sectionsResponse.__exam__.__sections__,
      sectionToAnswerSheets,
      examLeftTimeInSeconds: diff,
    },
  };
};
