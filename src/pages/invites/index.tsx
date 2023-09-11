import { useEffect, useState, FC } from "react";
import { TfiReload } from "react-icons/tfi";

import Search from "@/components/search";
import Layout from "@/components/layout";
import Placeholder from "@/components/placeholder";
import CardsRow from "@/components/cardsRow";

import examService from "@/services/examService";

import { Invitation } from "@/types/invitation";

import styles from "./styles.module.scss";
import { ThreeDots } from "react-loader-spinner";

const Invitations: FC = () => {
  const [loading, setLoading] = useState(true);
  const [allInvitations, setAllInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");
  const [cardsRows, setCardsRows] = useState<
    {
      title: string;
      cards: Invitation[];
      placeholder: string;
      open: boolean;
      type?: "denied" | "expired" | null;
    }[]
  >([]);

  const fetchData = async () => {
    setLoading(true);
    let invitationsResponse: Invitation[] = await examService.getInvitations();

    setAllInvitations(invitationsResponse);

    let pendingInvitationsData: Invitation[] = [];
    let expiredInvitationsData: Invitation[] = [];
    let deniedInvitationsData: Invitation[] = [];

    invitationsResponse.forEach((invitation: Invitation) => {
      let currentDate = new Date();
      let invitationDate = new Date(invitation.inviteDate);
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
    })

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
        placeholder: "Você ainda não possui convites expirados",
        type: "expired",
      },
      {
        title: "Convites Negados",
        cards: deniedInvitationsData,
        open: true,
        placeholder: "Você ainda não possui testes convites negados",
        type: "denied",
      },
    ]);

    setLoading(false);
  };

  useEffect(() => {
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
    <Layout sidebar active={2} header headerTitle="Seus Convites">
      <div className={styles.container}>
        {!loading && allInvitations.length === 0 ? (
          <Placeholder
            title="Sem convites por aqui... Aguardemos até que seja chamado para um teste!"
            subtitle="Enquanto isso, dê uma olhada nos testes públicos"
            buttonText="Ver testes públicos"
          />
        ) : (
          <>
            <div className={styles.contentHeader}>
              <Search
                search={search}
                onSearch={setSearch}
                placeholder="Pesquisar convites"
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
    </Layout>
  );
};

export default Invitations;
