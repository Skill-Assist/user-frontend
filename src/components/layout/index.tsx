import { ReactNode, FC, useState, useRef, useEffect } from "react";

import Sidebar from "../sidebar";
import Header from "../header";

import { Question } from "@/types/question";

import {
  keyStrokesProctoring,
  mouseProctoring,
} from "@/pages/exams/[answerSheetId]/[section2ASId]";

import styles from "./styles.module.scss";

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
  contentClassName?: string;
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
  contentClassName
}: Props) => {
  const [show, setShow] = useState(sidebarClosed ? false : true);

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
          } ${contentClassName ? contentClassName : {}}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;