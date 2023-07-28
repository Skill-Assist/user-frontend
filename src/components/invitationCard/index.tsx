import { useState, FC } from "react";
import { AnimatePresence } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/router";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import Modal from "../modal";
import Timer from "../timer";

import { Invitation } from "@/types/invitation";

import examService from "@/services/examService";

import styles from "./styles.module.scss";
import { AiOutlineReload } from "react-icons/ai";
import { BiArchiveIn } from "react-icons/bi";

type Props = {
  invitation: Invitation;
  denied?: boolean;
  expired?: boolean;
};

const InvitationCard: FC<Props> = ({ invitation, denied, expired }: Props) => {
  const { examRef: exam } = invitation;
  const { createdByRef: company } = exam;

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => {
    setShowModal(true);
    setLoading(false);
  };
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    await examService.acceptInvitation(invitation.id);
    router.push(`/exams`);
  };

  const denyHandler = async () => {
    setLoading(true);
    await examService.denyInvitation(invitation.id);
    router.reload();
  };

  const examTitle = `${exam.title} ${exam.subtitle && exam.subtitle} ${
    exam.level && exam.level
  }`;

  let invitationDate = new Date(invitation.inviteDate);
  const currentDate = new Date();

  const timeSpent = Math.floor(
    (currentDate.getTime() - invitationDate.getTime()) / 1000
  );

  const diff = invitation.expirationInHours * 3600 - timeSpent;

  let invitationLeftTime: Date = new Date();

  invitationLeftTime.setSeconds(invitationLeftTime.getSeconds() + diff);

  return (
    <>
      <div className={styles.card}>
        <div
          className={styles.header}
          style={{ backgroundColor: company.color }}
        >
          <Image
            className={styles.logo}
            src={company.logo}
            width={400}
            height={400}
            alt="company name"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{examTitle}</h2>

          <span className={styles.company}>{company.name}</span>

          {denied && (
            <div className={styles.denied}>
              <span>Convite negado</span>
              <button
                onClick={() =>
                  toast.loading("Feature em desenvolvimento", {
                    duration: 3000,
                    position: "top-right",
                  })
                }
              >
                <BiArchiveIn size={25} fill="var(--neutral-0)" />
                Arquivar convite
              </button>
            </div>
          )}

          {expired && (
            <div className={styles.expired}>
              <span>Convite expirado</span>
              <button
                onClick={() =>
                  toast.loading("Feature em desenvolvimento", {
                    duration: 3000,
                    position: "top-right",
                  })
                }
              >
                <AiOutlineReload size={25} fill="var(--neutral-0)" />
                Solicitar novo convite
              </button>
            </div>
          )}

          {!denied && !expired && (
            <>
              <div className={styles.timer}>
                <div>
                  Faltam <Timer expiryTimestamp={invitationLeftTime} />
                </div>
                para seu convite expirar
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => {
                    open();
                  }}
                >
                  Negar
                </button>
                <button onClick={handleAccept}>Aceitar</button>
              </div>
            </>
          )}
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
                    <strong>{examTitle}</strong>?
                  </p>
                  <div className={styles.modalActions}>
                    <button onClick={close}>Cancelar</button>
                    <button onClick={denyHandler}>Confirmar</button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <Toaster />
    </>
  );
};

export default InvitationCard;
