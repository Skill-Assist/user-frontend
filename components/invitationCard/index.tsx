import React, { useState } from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import { Invitation } from "@/types/invitation";
import { AnimatePresence } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import Modal from "../modal";
import examService from "@/services/examService";
import { useRouter } from "next/router";

type Company = {
  name: string;
  color: string;
  logo: string;
};

type Props = {
  company: Company;
  invitation: Invitation;
};

const InvitationCard: React.FC<Props> = ({ company, invitation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);
  const router = useRouter();

  const handleAccept = async () => {
    await examService.acceptInvitation(invitation.id);
    router.push(`/exams`);
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header} style={{ backgroundColor: company.color }}>
          <Image
            className={styles.logo}
            src={company.logo}
            width={400}
            height={400}
            alt="company name"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            title, subtitle
            level
          </h2>

          <span className={styles.company}>owner</span>

          <div className={styles.actions}>
            <button onClick={() => {
              open();
            }}>Negar</button>
            <button onClick={handleAccept}>Aceitar</button>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={close}
            dimensions={{
              height: "min-content",
              width: "600px",
            }}
          >
            <div className={styles.modalContainer}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <TailSpin
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              ) : (
                <>
                  <h2 className={styles.modalTitle}>Você tem certeza?</h2>
                  <p className={styles.modalText}>
                    Você tem certeza que deseja negar o convite para o exame{" "}
                    <strong>invitation.examRef.title</strong>?
                  </p>
                  <div className={styles.modalActions}>
                    <button onClick={close}>Cancelar</button>
                    <button>Confirmar</button>
                  </div>

                </>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvitationCard;
