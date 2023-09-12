import Layout from "@/components/layout";
import { useEffect, useState, FC } from "react";
import styles from "./styles.module.scss";

import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";
import Search from "@/components/search";
import ExamCard from "@/components/examCard";
import Placeholder from "@/components/placeholder";
import { TfiReload } from "react-icons/tfi";
import { ThreeDots } from "react-loader-spinner";

const Exams: FC = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    let examsResponse = await examService.getExams();
    setExams(examsResponse);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout header headerTitle="Seus testes" sidebar active={1}>
      <div className={styles.container}>
        {!loading && exams.length === 0 ? (
          <Placeholder
            title="Ops, parece que você não está inscrito para nenhum teste"
            subtitle="Enquanto isso, dê uma olhada nos testes públicos"
            buttonText="Ver testes públicos"
          />
        ) : (
          <>
            <div className={styles.contentHeader}>
              <Search
                search={search}
                onSearch={setSearch}
                placeholder="Pesquisar testes"
              />
              <button onClick={fetchData}>
                {loading ? (
                  <div>
                    <ThreeDots
                      height="15"
                      width="15"
                      radius="9"
                      color="var(--primary)!important"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      visible={true}
                    />
                  </div>
                ) : (
                  <>
                    <TfiReload size={20} fill="var(--primary)" />

                    <span>Atualizar</span>
                  </>
                )}
              </button>
            </div>
            <div className={styles.cardsContainer}>
              <div className={styles.cards}>
                {loading ? (
                  <ThreeDots
                    height="15"
                    width="15"
                    radius="9"
                    color="var(--primary)!important"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    visible={true}
                  />
                ) : (
                  exams &&
                  exams.slice(0, 5).map((invitation: Invitation) => (
                    <ExamCard invitation={invitation} key={invitation.id}/>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Exams;
