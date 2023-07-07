import { useEffect, useState } from "react";

import InvitationCard from "@/components/invitationCard";
import Search from "@/components/search";
import Layout from "@/components/layout";
import InvitationPlaceholder from "@/components/InvitationPlaceholder";
import Placeholder from "@/components/placeholder";
import CardsRow from "@/components/cardsRow";

import examService from "@/services/examService";
import userService from "../../services/userService";

import { Invitation } from "@/types/invitation";

import styles from "./styles.module.scss";

const Invitations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allExams, setAllExams] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");
  const [cardsRows, setCardsRows] = useState<
    {
      title: string;
      cards: Invitation[];
      placeholder: string;
      open: boolean;
      type?: 'denied' | 'expired' | null;
    }[]
  >([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let invitationsResponse: Invitation[] =
        await examService.getInvitations();

      setAllExams(invitationsResponse);

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
          const alreadyExists = expiredInvitationsData.find(
            (item) => item.id === invitation.id
          );
          if (!alreadyExists) {
            expiredInvitationsData.push(invitation);
          }
        }

        if (invitation.accepted === false) {
          const alreadyExists = deniedInvitationsData.find(
            (item) => item.id === invitation.id
          );
          if (!alreadyExists) {
            deniedInvitationsData.push(invitation);
          }
        }
      });

      setCardsRows([
        {
          title: "Convites Pendentes",
          cards: pendingInvitationsData,
          open: true,
          placeholder: "Você ainda não possui convites pendentes",
        },
        {
          title: "Convites Expirados",
          cards: expiredInvitationsData,
          open: true,
          placeholder: "Você ainda não possui cnvites expirados",
          type: 'expired'
        },
        {
          title: "Convites Negados",
          cards: deniedInvitationsData,
          open: true,
          placeholder: "Você ainda não possui testes convites negados",
          type: 'denied'
        },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleRow = (index: number) => {
    setCardsRows(
      cardsRows.map((row, i) => {
        if (i === index) {
          row.open = !row.open;
        } else {
          row.open = row.open;
        }

        return row;
      })
    );
  };

  return (
    <Layout sidebar footer header headerTitle="Seus Convites" active={2}>
      <div>
        <div className={styles.container}>
          {!loading && allExams.length === 0 ? (
            <Placeholder />
          ) : (
            <>
              <Search
                search={search}
                onSearch={setSearch}
                placeholder="Pesquisar convites"
              />

              {cardsRows.map((row, index) => (
                <CardsRow
                  key={index}
                  title={row.title}
                  loading={loading}
                  cards={row.cards}
                  open={row.open}
                  index={index}
                  placeholder={row.placeholder}
                  toggleRow={toggleRow}
                  type={row.type}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Invitations;
