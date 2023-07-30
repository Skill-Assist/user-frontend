import { useState, FormEvent, useEffect } from 'react';
import cookie from 'react-cookies';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { TailSpin } from 'react-loader-spinner';
import { FaHourglassHalf } from 'react-icons/fa';

import Modal from '@/components/modal';
import Layout from '@/components/layout';
import Card from '@/components/card';
import Button from '@/components/button';
import Timer from '@/components/timer';

import { Section } from '@/types/section';
import { Section2AS } from '@/types/section2AS';

import examService from '@/services/examService';

import styles from './styles.module.scss';
import answerSheetService from '@/services/answerSheetService';
import { toast } from 'react-hot-toast';

const ExamPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsData, setSectionsData] = useState<Section[]>();
  const [sectionToAnswerSheets, setSectionToAnswerSheets] =
    useState<Section2AS[]>();
  const [examLeftTimeInSeconds, setExamLeftTimeInSeconds] = useState<number>();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  // Given the following code, what is the best way to refactor it?
  const fetchData = async () => {
    const { answerSheetId } = router.query;

    if (answerSheetId) {
      const answerSheetResponse = await answerSheetService.getAnswerSheet(
        answerSheetId as string
      );

      if (answerSheetResponse.status >= 200 && answerSheetResponse.status < 300) {
        setSectionToAnswerSheets(
          answerSheetResponse.data[0].__sectionToAnswerSheets__
        );
      }
 
      const sectionsResponse =
        await answerSheetService.getSectionsFromAnswerSheet(
          answerSheetId as string
        );

      if (sectionsResponse.status >= 200 && sectionsResponse.status < 300) {
        setSectionsData(sectionsResponse.data[0].__exam__.__sections__);
      }

      const termData = {
        startDate: answerSheetResponse.data[0].startDate,
        durationInHours: answerSheetResponse.data[0].__exam__.durationInHours,
      };

      const startExamDate = new Date(termData.startDate);
      const currentDate = new Date();

      const timeSpent = Math.floor(
        (currentDate.getTime() - startExamDate.getTime()) / 1000
      );

      const diff = termData.durationInHours * 3600 - timeSpent;

      setExamLeftTimeInSeconds(diff);

      if (diff <= 0) {
        return {
          redirect: {
            destination: '/exams',
            permanent: false,
          },
        };
      }
    }

    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (pageLoading) {
    return (
      <div className="loadingContainer">
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
    );
  } else if (
    !sectionsData ||
    !sectionToAnswerSheets ||
    !examLeftTimeInSeconds
  ) {
    cookie.remove('token');
    toast.error('Sua sessão expirou. Faça login novamente', {
      icon: '⏱️',
    });
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }, 2000);
    return;
  } else {
    let examLeftTime: Date = new Date();

    if (examLeftTimeInSeconds) {
      examLeftTime.setSeconds(
        examLeftTime.getSeconds() + examLeftTimeInSeconds
      );
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

    const submitHandler = async (e: FormEvent<HTMLFormElement> | null) => {
      if (e) {
        e.preventDefault();
      }

      setLoading(true);
      await examService
        .submitExam(router.query.answerSheetId as string)
        .then(() => {
          router.push(`/exams/completion/${router.query.answerSheetId}`);
        });
    };

    return (
      <>
        <Layout sidebar active={1} sidebarClosed header headerTitle="Seu Exame">
          <>
            <header className={styles.header}>
              <h3>Etapas</h3>
              <p>
                <FaHourglassHalf /> Tempo restante para o teste:{' '}
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
                <div className={styles.cardWrapper} key={index}>
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
                              ? 'Resolver'
                              : sectionToAnswerSheets[index]?.endDate
                              ? 'Finalizado'
                              : 'Resolver'
                          }
                          type={
                            sectionToAnswerSheets.length === 0
                              ? 'solve'
                              : sectionToAnswerSheets[index]?.endDate
                              ? 'finished'
                              : 'solve'
                          }
                          onClick={
                            sectionToAnswerSheets[index]?.endDate
                              ? () => {
                                  console.log('oi');
                                }
                              : sectionToAnswerSheets[index]?.startDate
                              ? () => {
                                  router.push(
                                    `/exams/${router.query.answerSheetId}/${sectionToAnswerSheets[index]?.id}`
                                  );
                                }
                              : () => startSectionHandler(section.id)
                          }
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
          </>
        </Layout>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {showModal && (
            <Modal
              handleClose={close}
              dimensions={{
                height: '200px',
                width: '600px',
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
  }
};

export default ExamPage;
