import { ReactNode, FC, useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";

import Sidebar from "../sidebar";
import Header from "../header";

import styles from "./styles.module.scss";
import { Question } from "@/types/question";
import {
  keyStrokesProctoring,
  mouseProctoring,
} from "@/pages/exams/[answerSheetId]/[section2ASId]";

type Props = {
  sidebar?: boolean;
  sidebarClosed?: boolean;
  questions?: Question[];
  setQuestionIndex?: (index: number) => void;
  questionIndex?: number;
  answer?: string;
  answersId?: number[];
  setAnswer?: (answer: string) => void;
  keyboard?: keyStrokesProctoring;
  mouseTrack?: mouseProctoring;
  active: number;
  header?: boolean;
  headerTitle?: string;
  goBack?: boolean;
  children: ReactNode;
  confetti?: boolean;
};

const Layout: FC<Props> = ({
  sidebar,
  sidebarClosed,
  questions,
  setQuestionIndex,
  questionIndex,
  answer,
  answersId,
  setAnswer,
  keyboard,
  mouseTrack,
  active,
  header,
  headerTitle,
  goBack,
  children,
  confetti,
}: Props) => {
  const [show, setShow] = useState(sidebarClosed ? false : true);
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const confetiRef = useRef(null);

  useEffect(() => {
    if (confetti) {
      if (confetiRef.current) {
        // @ts-ignore
        setHeight(confetiRef.current?.clientHeight);
        // @ts-ignore
        setWidth(confetiRef.current?.clientWidth);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      {sidebar && (
        <Sidebar
          active={active}
          show={show}
          setShow={setShow}
          questions={questions}
          setQuestionIndex={setQuestionIndex}
          questionIndex={questionIndex}
          answer={answer}
          answersId={answersId}
          setAnswer={setAnswer}
          keyboard={keyboard}
          mouseTrack={mouseTrack}
        />
      )}

      <div className={styles.rightContainer}>
        {header && (
          <Header title={headerTitle} goBack={goBack ? true : false} />
        )}
        <div
          className={`${!header ? styles.noHeader : styles.withHeader} ${
            styles.content
          }`}
          ref={confetti ? confetiRef : null}
        >
          {children}
          {confetti && (
            // @ts-ignore
            <Confetti numberOfPieces={150} width={width} height={height} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
