import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import InvitationCard from "@/components/invitationCard";

import userService from "../../services/userService";
import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";
import Search from "@/components/search";
import InvitationPlaceholder from "@/components/InvitationPlaceholder";

const Invitations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>(
    []
  );
  const [expiredInvitations, setExpiredInvitations] = useState<Invitation[]>(
    []
  );
  const [deniedInvitations, setDeniedInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let invitationsResponse: Invitation[] =
        await examService.getInvitations();

      let pendingInvitationsData: Invitation[] = [];
      let expiredInvitationsData: Invitation[] = [];
      let deniedInvitationsData: Invitation[] = [];

      invitationsResponse.forEach((invitation: Invitation) => {
        let currentDate = new Date();
        let invitationDate = new Date(invitation.createdAt);
        let deadline =
          invitationDate.getTime() +
          invitation.expirationInHours * 60 * 60 * 1000;
        let expired = deadline < currentDate.getTime() ? true : false;

        if (invitation.accepted === null && !expired) {
          const alreadyExists = pendingInvitationsData.find(
            (item) => item.id === invitation.id
          );

          if (!alreadyExists) {
            pendingInvitationsData.push(invitation);
          }
        }

        if (invitation.accepted === null && expired) {
          const alreadyExists = expiredInvitations.find(
            (item) => item.id === invitation.id
          );
          if (!alreadyExists) {
            expiredInvitationsData.push(invitation);
          }
        }

        if (invitation.accepted === false) {
          const alreadyExists = deniedInvitations.find(
            (item) => item.id === invitation.id
          );
          if (!alreadyExists) {
            deniedInvitationsData.push(invitation);
          }
        }
      });

      setPendingInvitations(pendingInvitationsData);
      setExpiredInvitations(expiredInvitationsData);
      setDeniedInvitations(deniedInvitationsData);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout sidebar footer header headerTitle="Seus Convites" active={2}>
      <div>
        <div className={styles.container}>
          {/* TODO: Implement search based in the exams owners */}
          <Search
            search={search}
            onSearch={setSearch}
            placeholder="Pesquisar convites"
          />

          {pendingInvitations.length === 0 &&
          expiredInvitations.length === 0 &&
          deniedInvitations.length === 0 ? (
            "Nenhum convite ainda."
          ) : (

<>
              <div className={styles.cardsContainer}>
                <div className={styles.cardsRow}>
                  <div className={styles.divisor}>
                    <p className={styles.pendingP}>Convites Pendentes</p>
                    <hr />
                  </div>
                  <div className={styles.cards}>
                    {!loading && pendingInvitations.length > 0 ? (
                      pendingInvitations.map((invitation: Invitation) => (
                        <>
                          <InvitationCard
                            key={invitation.id}
                            invitation={invitation}
                          />
                        </>
                      ))
                    ) : (
                      <InvitationPlaceholder />
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardsContainer}>
                <div className={styles.cardsRow}>
                  <div className={styles.divisor}>
                    <p>Convites Expirados</p>
                    <hr />
                  </div>
                  <div className={styles.cards}>
                    {!loading && expiredInvitations.length > 0 ? (
                      expiredInvitations.map((invitation: Invitation) => (
                        <>
                          <InvitationCard
                            key={invitation.id}
                            invitation={invitation}
                            expired
                          />
                        </>
                      ))
                    ) : (
                      <InvitationPlaceholder />
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardsContainer}>
                <div className={styles.cardsRow}>
                  <div className={styles.divisor}>
                    <p>Convites Negados</p>
                    <hr />
                  </div>
                  <div className={styles.cards}>
                    {!loading && deniedInvitations.length > 0 ? (
                      deniedInvitations.map((invitation: Invitation) => (
                        <>
                          <InvitationCard
                            key={invitation.id}
                            invitation={invitation}
                            denied
                          />
                        </>
                      ))
                    ) : (
                      <InvitationPlaceholder />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Invitations;
