import { TailSpin } from 'react-loader-spinner';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

import Layout from '@/components/layout';
import ResultCard from '@/components/resultCard';

import examService from '@/services/examService';

import { Invitation } from '@/types/invitation';

import styles from './styles.module.scss';

const Results = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [resultData, setResultData] = useState<Invitation[]>();

  const router = useRouter();

  const fetchData = async () => {
    setPageLoading(true);

    const response = await examService.getExams();

    if (response) {
      const finishedAnswerSheets = response.filter((invitation: Invitation) => {
        if (invitation.examRef.answerSheetsRef) {
          return invitation.examRef.answerSheetsRef.endDate !== null;
        }
      });

      setResultData(finishedAnswerSheets);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header headerTitle="Dashboard" active={0}>
        <div className="loadingContainer">
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
      </Layout>
    );
  } else if (!resultData) {
    toast.error('Erro em buscar os dados, tente novamente', {
      duration: 4000,
    });
    setTimeout(() => {
      router.push('/exams');
    }, 2000);
    return;
  } else {
    return (
      <div className={styles.container}>
        <Layout header headerTitle="Seus Resultados" sidebar active={3}>
          <div className={styles.content}>
            {resultData.length === 0 ? (
              <p>Sem Resultados</p>
            ) : (
              resultData.map((invitation: Invitation) => (
                <ResultCard key={invitation.id} invitation={invitation} />
              ))
            )}
          </div>
        </Layout>
      </div>
    );
  }
};

export default Results;
