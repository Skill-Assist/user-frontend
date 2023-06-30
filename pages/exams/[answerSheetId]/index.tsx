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

interface Term {
  deadline?: string;
  durationInHours?: number;
  startDate: string;
}

interface Props {
  sectionsData: Section[];
  section2ASData: Section2AS[];
  termData: Term;
  user: any;
}

const ExamPage: FC<Props> = ({
  sectionsData,
  section2ASData,
  termData: { durationInHours, startDate },
  ...ExamPage
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  let examLeftTime: Date = new Date();
  let user = ExamPage;

  if (durationInHours) {
    const startExamDate = new Date(startDate);
    const currentDate = new Date();

    const timeSpent = Math.floor(
      (currentDate.getTime() - startExamDate.getTime()) / 1000
    );

    const diff = durationInHours * 3600 - timeSpent;

    examLeftTime.setSeconds(examLeftTime.getSeconds() + diff);
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
        user={user}
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
            {/* {sectionsData.map((section, index) => (
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
                          section2ASData[index]?.endDate
                            ? "Finalizado"
                            : "Resolver"
                        }
                        type={
                          section2ASData[index]?.endDate ? "finished" : "solve"
                        }
                        onClick={() => startSectionHandler(section.id)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))} */}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.rolesBtn}
                onClick={() => {
                  setModalContent("role");
                  open();
                }}
              >
                Ver Regras
              </button>
              <button
                onClick={() => {
                  setModalContent("submit");
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
              {modalContent === "submit" && (
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
                            setModalContent("");
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
              )}
              {modalContent === "role" && (
                <>
                  <h1>Regras</h1>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatum.
                  </p>
                  <div className={styles.buttons}>
                    <Button
                      text="Voltar"
                      type="cancel"
                      onClick={() => {
                        setModalContent("");
                        close();
                      }}
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

export default ExamPage;

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<any> => {
  const { token } = ctx.req.cookies;

  const { answerSheetId } = ctx.params as { answerSheetId: string };

  const answerSheetResponse = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + `/answer-sheet/findOne?key=id&value=${answerSheetId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  const termData = {
    startDate: answerSheetResponse.startDate,
    // durationInHours:
    //   answerSheetResponse.examRef.durationInHours !== null
    //     ? answerSheetResponse.examRef.durationInHours
    //     : 5,
    durationInHours: 30,
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

  return {
    props: {
      // sectionsData: answerSheetResponse.sections,
      // section2ASData: answerSheetResponse.sectionToAnswerSheetsRef,
      termData,
    },
  };
};
