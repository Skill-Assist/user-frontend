import Layout from "@/components/layout";
import { useEffect, useState, FC } from "react";
import styles from "./styles.module.scss";

import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";
import Search from "@/components/search";
import ExamCard from "@/components/examCard";


const Invitations: FC = () => {
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let invitationsResponse = await examService.getExams();
      setInvitations(invitationsResponse)
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout
      sidebar
      footer
      header
      headerTitle="Seus Exames"
      active={1}
    >
      <div>
        <div className={styles.container}>
          {/* TODO: Implement search based in the exams owners */}
          <Search
            search={search}
            onSearch={setSearch}
            placeholder="Pesquisar exames"
          />

          {
            !loading && invitations.length === 0 ? (
              "Você não não está inscrito em nenhum exame ainda."
            ) : (
              <div className={styles.cardsContainer}>
                <div className={styles.cards}>
                  {!loading && invitations && invitations.map((invitation: Invitation) => (
                    <ExamCard invitation={invitation} />
                  ))}
                </div>
              </div>
            )
          }
        </div>
      </div>
    </Layout>
  );
};

export default Invitations;
