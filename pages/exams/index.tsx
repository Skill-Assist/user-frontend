import Header from "@/components/header";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import ExamCard from "@/components/examCard";

import userService from "../../services/userService";
import { Exam } from "@/types/exam";
import examService from "@/services/examService";

const Exams: React.FC = (user: any) => {
  const company = [
    {
      color: "#00E519",
      logo: "/images/ultrapar.jpg",
      name: "Ultrapar",
    },
    {
      color: "#00428D",
      logo: "/images/ambev.svg",
      name: "Ambev",
    },
    {
      color: "#251E32",
      logo: "/images/inteli.svg",
      name: "Inteli",
    },
  ];

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [profile, setProfile] = useState<any>(user);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let userResponse = await userService.getProfile();
      setProfile(userResponse.data);

      const examResponse = await examService.getExams(userResponse.data.enrolledExamsRef);
      console.log(examResponse)
      setExams(examResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  const showExams = () => {
    if (profile && exams) {
      return exams.map((exam: Exam, index: number) => {
        if (exam.status === "live") {
          return <ExamCard company={company[index]} exam={exam} key={index} />;
        }
      });
    }
    return "Não há exames disponíveis.";
  };

  return (
    <Layout
      sidebar
      footer
      header
      headerTitle="Seus Testes"
      active={1}
      user={profile ? profile : false}
    >
      <div>
        <div className={styles.container}>{!loading && showExams()}</div>
      </div>
    </Layout>
  );
};

export default Exams;
