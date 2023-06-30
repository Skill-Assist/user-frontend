import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import InvitationCard from "@/components/invitationCard";

import userService from "../../services/userService";
import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";
import Search from "@/components/search";


const Invitations: React.FC = (user: any) => {
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
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [profile, setProfile] = useState<any>(user);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let userResponse = await userService.getProfile();
      setProfile(userResponse.data);

      let invitationsResponse = await examService.getInvitations(userResponse.data.invitationsRef);
      setInvitations(invitationsResponse);
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
      user={profile ? profile : false}
    >
      <div>
        <div className={styles.container}>
          <Search
            search={search}
            onSearch={setSearch}
            placeholder="Pesquisar convites"
          />

          <div className={styles.cards}>

            {!loading && profile && invitations ? invitations.map((invitation: any, index: number) => {
              if (invitation.data[0].accepted === false) {
                return <InvitationCard company={company[index]} invitation={invitation.data[0]} key={index} />;
              }
            })
              :
              "Você não foi convidado para nenhum exame ainda."
            }

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invitations;
