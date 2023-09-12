import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

import questionService from "@/services/questionService";

import { Question } from "@/types/question";
import {
  keyStrokesProctoring,
  mouseProctoring,
} from "@/pages/exams/[answerSheetId]/[section2ASId]";

import Logo from "public/logo.svg";
import HomeIcon from "public/icons/home.svg";
import ExamsIcon from "public/icons/exams.svg";
import InviteIcon from "public/icons/invite.svg";
import ResultsIcon from "public/icons/trophy.svg";
import SupportIcon from "public/icons/support.svg";

import styles from "./styles.module.scss";

type Props = {
  active: number;
  questions?: Question[];
  setQuestionIndex?: (index: number) => void;
  questionIndex?: number;
  show: boolean;
  setShow: (show: boolean) => void;
  answer?: string;
  answersId?: number[];
  setAnswer?: (answer: string) => void;
  keyboard?: keyStrokesProctoring;
  mouseTrack?: mouseProctoring;
};

const Sidebar: FC<Props> = ({
  active,
  show,
  setShow,
  questions,
  setQuestionIndex,
  questionIndex,
  answer,
  answersId,
  setAnswer,
  keyboard,
  mouseTrack,
}: Props) => {
  const navigationItems = [
    {
      icon: HomeIcon,
      text: "Home",
      url: "/",
    },
    {
      icon: ExamsIcon,
      text: "Seus Testes",
      url: "/exams",
    },
    {
      icon: InviteIcon,
      text: "Seus Convites",
      url: "/invites",
    },
    {
      icon: ResultsIcon,
      text: "Resultados",
      url: "/results",
    },
    {
      icon: SupportIcon,
      text: "Suporte",
      url: "/help",
    },
  ];

  const navigateHandler = async (index: number) => {
    if (
      questions &&
      setQuestionIndex &&
      answersId &&
      setAnswer &&
      keyboard &&
      mouseTrack
    ) {
      if (answer && answer !== "" && questionIndex) {
        const response = await questionService
          .updateAnswer(answersId[questionIndex], answer)
          .then(() => {
            setQuestionIndex(index);
            setAnswer("");
          });
      } else if (questionIndex === 0 && answer) {
        const response = await questionService
          .updateAnswer(answersId[0], answer)
          .then(() => {
            setQuestionIndex(index);
            setAnswer("");
          });
      } else {
        setQuestionIndex(index);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src={Logo}
          alt="Logo da plataforma"
          onClick={() => {
            setShow(!show);
          }}
        />
      </div>

      <div className={`${styles.navigation} `}>
        {questions && setQuestionIndex
          ? questions.map((item, index) => (
              <button
                onClick={() => navigateHandler(index)}
                className={`
                ${styles.item} 
                ${active === index ? styles.active : ""} 
                `}
                key={index}
              >
                <div className={styles.itemContainer}>
                  <span
                    className={`${styles.itemText} ${show ? styles.open : {}}`}
                  >
                    Questão {index + 1}
                  </span>
                </div>
              </button>
            ))
          : navigationItems.map((item, index) => (
              <Link
                href={item.url}
                className={`
                ${styles.item} 
                ${active === index ? styles.active : ""} 
                `}
                key={item.text}
              >
                <div className={styles.itemContainer}>
                  <Image
                    className={styles.itemIcon}
                    src={item.icon}
                    alt="Logo da plataforma"
                  />
                  <span
                    className={`${styles.itemText} ${show ? styles.open : {}}`}
                  >
                    {item.text}
                  </span>
                </div>
              </Link>
            ))}
      </div>

      {/* <div className={`${styles.footer} ${show ? styles.openFooter : {}}`}>
        <span>
          &copy; {new Date().getFullYear()} Skill Assist | All rights reserved
        </span>
      </div> */}
    </div>
  );
};

export default Sidebar;
