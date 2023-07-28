import { useEffect, useState, FC, ChangeEvent } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FaHourglassHalf } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  AiOutlineClockCircle,
  AiFillEyeInvisible,
  AiFillEye,
  AiOutlineReload,
} from "react-icons/ai";
import parse from "html-react-parser";

import ProgammingQuestion from "@/components/questions/programming";
import Layout from "@/components/layout";
import Card from "@/components/card";
import MultipleChoiceQuestion from "@/components/questions/multipleChoice";
import TextQuestion from "@/components/questions/text";
import ChallengeQuestion from "@/components/questions/challenge";
import Timer from "@/components/timer";

import questionService from "@/services/questionService";

import { Question } from "@/types/question";
import { Section2AS } from "@/types/section2AS";

import styles from "./styles.module.scss";
import { toast } from "react-hot-toast";

export type Option = {
  [key: string]: string;
};

interface Props {
  sectionName: string;
  sectionToAnswerSheet: Section2AS;
  sectionLeftTimeInSeconds: number;
  answersId: number[];
}

export type keyStrokesProctoring = {
  ctrlCAmount: number;
  ctrlVAmount: number;
  altAmount: number;
  keysProctoring: string[];
};

export type mouseProctoring = {
  mouseLeave: Date;
  mouseEnter: Date;
  questionId: string;
}[];

const Section: FC<Props> = ({
  sectionName,
  sectionToAnswerSheet,
  sectionLeftTimeInSeconds,
  answersId,
}: Props) => {
  const { startDate: sectionStartDate } = sectionToAnswerSheet;

  let startDate = new Date(sectionStartDate);
  let currentDate = new Date();

  let spentTime = currentDate.getTime() - startDate.getTime();

  let spentTimeInSeconds = Math.floor(spentTime / 1000);
  let spentTimeInMinutes = Math.floor(spentTimeInSeconds / 60);

  let sectionLeftTime: Date = new Date();

  if (sectionLeftTimeInSeconds) {
    sectionLeftTime.setSeconds(
      sectionLeftTime.getSeconds() + sectionLeftTimeInSeconds
    );
  }

  const [questionIndex, setQuestionIndex] = useState(0);
  const [showStatistics, setShowStatistics] = useState(true);
  const [questions, setQuestions] = useState<Question[]>();
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [answer, setAnswer] = useState("");
  const [fileAnswer, setFileAnswer] = useState<File>();
  const [sectionSpentTime, setSectionSpentTime] = useState(spentTimeInMinutes);

  const [mouseOut, setMouseOut] = useState<Date | null>(null);
  const [mouseTrack, setMouseTrack] = useState<any>([]);
  const router = useRouter();

  const [keyboard, setKeyboard] = useState<keyStrokesProctoring>({
    altAmount: 0,
    ctrlCAmount: 0,
    ctrlVAmount: 0,
    keysProctoring: [],
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      setKeyboard((prevState) => {
        return {
          ctrlCAmount:
            prevState.ctrlCAmount + (event.ctrlKey && key === "c" ? 1 : 0),
          ctrlVAmount:
            prevState.ctrlVAmount + (event.ctrlKey && key === "v" ? 1 : 0),
          altAmount: prevState.altAmount + (event.altKey ? 1 : 0),
          keysProctoring: [...prevState.keysProctoring, key],
        };
      });
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setLoadingQuestions(true);
    const fetchData = async () => {
      const response = await questionService.getQuestions(answersId);

      setQuestions(response);
    };

    fetchData();

    setLoadingQuestions(false);
  }, []);

  useEffect(() => {
    const answerId = answersId[questionIndex];

    const fetchAnswer = async () => {
      const response = await questionService.getAnswer(answerId);

      if (response.status >= 200 && response.status < 300) {
        setAnswer(response.data.content);
      }
    };

    fetchAnswer();
  }, [questionIndex]);

  const handleTextAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const handleChallengeAnswerChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setFileAnswer(file);
      } else {
        toast.error("Por favor, selecione um arquivo ZIP válido.");
      }
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  if (loadingQuestions) {
    return <p>Loading...</p>;
  }

  if (!questions) {
    return <p>Questions not found...</p>;
  }

  const generateQuestions = (questionIndex: number) => {
    switch (questions[questionIndex].type) {
      case "programming":
        return (
          <ProgammingQuestion
            onChange={(value: string) => handleAnswerChange(value)}
            defaultAnswer={answer}
          />
        );

      case "challenge":
        return (
          <ChallengeQuestion
            handleChallengeAnswerChange={handleChallengeAnswerChange}
            fileAnswer={fileAnswer}
          />
        );

      case "multipleChoice":
        return (
          <MultipleChoiceQuestion
            options={questions[questionIndex].options}
            onChange={handleOptionChange}
            selectedOption={answer}
          />
        );

      case "text":
        return (
          <TextQuestion
            onChange={handleTextAnswerChange}
            defaultAnswer={answer}
          />
        );
    }
  };

  const previousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleMouseEnter = () => {
    if (mouseOut) {
      let time = new Date();
      setMouseTrack([
        ...mouseTrack,
        {
          mouseLeave: mouseOut,
          mouseEnter: time,
          questionId: answersId[questionIndex].toString(),
        },
      ]);
    }
  };

  const handleMouseLeave = () => {
    let time = new Date();
    setMouseOut(time);
  };

  const reloadHandler = () => {
    setSectionSpentTime(spentTimeInMinutes);
  };

  const submitHandler = async () => {
    if (questions[questionIndex].type === "challenge") {
      const formData = new FormData();
      if (fileAnswer) {
        const maxSize = 10 * 1024 * 1024;
        if (fileAnswer.size > maxSize) {
          toast.error("O tamanho do arquivo não pode exceder 10MB.");
          return;
        }
        formData.append("content", "Archive.zip" as string);
        formData.append("file", fileAnswer);
      } else {
        toast.error("Por favor, selecione um arquivo ZIP válido.");
        return;
      }
      if (questionIndex < questions.length - 1) {
        const response = await questionService
          .updateFileAnswer(answersId[questionIndex], formData)
          .then(() => {
            setQuestionIndex(questionIndex + 1);
            setAnswer("");
          });
        // console.log("1", response);
      } else {
        formData.append("keyboard", JSON.stringify(keyboard) as string);
        formData.append("mouse", JSON.stringify(mouseTrack) as string);

        const response = await questionService.updateLastFileAnswer(
          answersId[questionIndex],
          formData
        )
        .then(() => {
          router.push(`/exams/${router.query.answerSheetId}`);
        });
        // console.log("2",response);
      }
    } else {
      if (questionIndex < questions.length - 1) {
        const response = await questionService
          .updateAnswer(answersId[questionIndex], answer)
          .then(() => {
            setQuestionIndex(questionIndex + 1);
            setAnswer("");
          });
        // console.log("3", response);
      } else {
        const response = await questionService.updateLastAnswer(
          answersId[questionIndex],
          answer,
          JSON.stringify(keyboard),
          JSON.stringify(mouseTrack)
        )
        .then(() => {
        router.push(`/exams/${router.query.answerSheetId}`);
        });
        // console.log("4", response);
      }
    }
  };

  return (
    <div
      className={styles.section}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      <Layout
        sidebar
        active={questionIndex}
        header
        goBack
        headerTitle={sectionName}
        questions={questions}
        setQuestionIndex={setQuestionIndex}
        questionIndex={questionIndex}
        answer={answer}
        answersId={answersId}
        setAnswer={setAnswer}
        keyboard={keyboard}
        mouseTrack={mouseTrack}
      >
        <div className={styles.question}>
          <div className={styles.standardStructure}>
            <div className={styles.statement}>
              <Card>
                <h2 className={styles.title}>Questão</h2>
                <div className={styles.background}>
                  <div className={styles.questionText}>
                    <p>{parse(questions[questionIndex].statement)}</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className={styles.statistics}>
              <Card>
                <div className={styles.statisticsCard}>
                  <div className={styles.statisticsHeader}>
                    <h2>Estatísticas</h2>
                    <div className={styles.actions}>
                      <AiOutlineReload onClick={reloadHandler} />
                      {showStatistics && (
                        <AiFillEyeInvisible onClick={toggleStatistics} />
                      )}
                      {!showStatistics && (
                        <AiFillEye onClick={toggleStatistics} />
                      )}
                    </div>
                  </div>
                  <ul>
                    <li>
                      <FaHourglassHalf />
                      <p className={styles.leftTime}>
                        Tempo restante:{" "}
                        {showStatistics ? (
                          <Timer
                            expiryTimestamp={sectionLeftTime}
                            onTimeIsOver={submitHandler}
                          />
                        ) : (
                          "--:--"
                        )}
                      </p>
                    </li>
                    <li>
                      <IoDocumentTextOutline />
                      <p>
                        Questão atual:{" "}
                        {showStatistics
                          ? questionIndex + 1 + "/" + questions.length
                          : " --"}
                      </p>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
          <div className={styles.solution}>
            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.title}>Solução</h2>
                <div className={styles.answerContainer}>
                  {generateQuestions(questionIndex)}
                </div>
                <div
                  className={`${styles.actions} ${
                    questionIndex === 0 && styles.oneBtn
                  }`}
                >
                  {questionIndex > 0 && (
                    <button onClick={previousQuestion}>Anterior</button>
                  )}
                  <button onClick={submitHandler}>
                    {questionIndex < questions.length - 1
                      ? "Próxima"
                      : "Finalizar seção"}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  const { answerSheetId, section2ASId } = ctx.params as {
    answerSheetId: string;
    section2ASId: string;
  };

  const section2ASResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/section-to-answer-sheet/findOne?key=id&value=${section2ASId}&relations=answers,section&map=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  const sectionName = section2ASResponse.__section__.name;

  const answersId = section2ASResponse.__answers__.map(
    (answer: any) => answer.id
  );

  const startExamDate = new Date(section2ASResponse.startDate);
  const currentDate = new Date();

  const timeSpent = Math.floor(
    (currentDate.getTime() - startExamDate.getTime()) / 1000
  );

  const diff =
    section2ASResponse.__section__.durationInHours * 3600 - timeSpent;

  if (diff <= 0) {
    return {
      redirect: {
        destination: `/exams/${answerSheetId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      sectionName,
      sectionToAnswerSheet: section2ASResponse,
      sectionLeftTimeInSeconds: diff,
      answersId,
    },
  };
};

export default Section;