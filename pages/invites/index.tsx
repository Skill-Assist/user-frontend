import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import InvitationCard from "@/components/invitationCard";

import userService from "../../services/userService";
import examService from "@/services/examService";
import { Invitation } from "@/types/invitation";


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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let userResponse = await userService.getProfile();
      setProfile(userResponse.data);

      let invitesResponse = await examService.getInvitations(userResponse.data.invitationsRef);
      setInvitations(invitesResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  const showInvites = () => {
    if (profile && invitations) {
      return invitations.map((invitation: any, index: number) => {
        if (invitation[0].accepted === false) {
          return <InvitationCard company={company[index]} invitation={invitation[0]} key={index} />;
        }
      });
    }
    return "Você não foi convidado para nenhum exame ainda.";
  };

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
        <div className={styles.container}>{!loading && showInvites()}</div>
      </div>
    </Layout>
  );
};

export default Invitations;
