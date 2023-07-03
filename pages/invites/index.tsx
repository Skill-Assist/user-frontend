import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import InvitationCard from "@/components/invitationCard";

import userService from "../../services/userService";
import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";
import Search from "@/components/search";


const Invitations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [expiredInvitations, setExpiredInvitations] = useState<Invitation[]>([]);
  const [deniedInvitations, setDeniedInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let invitationsResponse = await examService.getInvitations();

      let pendingInvitationsData = invitationsResponse.filter((invitation: Invitation) => invitation.accepted === false)
      setPendingInvitations(pendingInvitationsData)


      // let expiredInvitationsData = invitationsResponse.filter((invitation: Invitation) => invitation.expirationInHours === false)
      // let deniedInvitationsData = invitationsResponse.filter((invitation: Invitation) => invitation.accepted === false)

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout
      sidebar
      footer
      header
      headerTitle="Seus Convites"
      active={2}
    >
      <div>
        <div className={styles.container}>
          {/* TODO: Implement search based in the exams owners */}
          <Search
            search={search}
            onSearch={setSearch}
            placeholder="Pesquisar convites"
          />

          {
            pendingInvitations.length === 0 &&
              expiredInvitations.length === 0 &&
              deniedInvitations.length === 0 ? (
              "Nenhum convite ainda."
            ) : (
              // TODO: Split the screen between: Pending, expired and denied invites

              <div className={styles.cardsContainer}>

                <div className={styles.pendingCards}>
                  <div className={styles.divisor}>
                    <p>Convites Pendentes</p>
                    <hr />
                  </div>
                  <div className={styles.cards}>
                    {!loading && pendingInvitations && pendingInvitations.map((invitation: Invitation) => (
                      <>
                      <InvitationCard invitation={invitation} />
                      </>
                    ))}
                  </div>
                </div>
              </div>
            )
          }




          {/* <div className={styles.cards}>

            {!loading && profile && invitations ? invitations.map((invitation: any, index: number) => {
              if (invitation.data[0].accepted === false) {
                return <InvitationCard company={company[index]} invitation={invitation.data[0]} key={index} />;
              }
            })
              :
              "Você não foi convidado para nenhum exame ainda."
            }

          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default Invitations;
