import { useState, useEffect } from 'react';
import cookie from 'react-cookies';
import { useRouter } from 'next/router';
import { useLottie } from 'lottie-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';

import Layout from '@/components/layout';

import Success from '@public/lottie/success.json';

import answerSheetService from '@/services/answerSheetService';

import styles from './styles.module.scss';

const CompletionPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [showScore, setShowScore] = useState<boolean>();

  const router = useRouter();

  const options = {
    animationData: Success,
    loop: true,
  };

  const { View } = useLottie(options);

  const fetchData = async () => {
    const { answerSheetId } = router.query;

    if (answerSheetId) {
      const answerSheetResponse = await answerSheetService.getAnswerSheet(
        answerSheetId as string
      );

      if (
        answerSheetResponse.status >= 200 &&
        answerSheetResponse.status < 300
      ) {
        setShowScore(answerSheetResponse.data[0].__exam__.showScore);
      } else {
        toast.error('Não foi possível obter os dados do exame');
      }
    }

    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (pageLoading) {
    return (
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
    );
  } else if (!showScore) {
    cookie.remove('token');
    toast.error('Sua sessão expirou. Faça login novamente', {
      icon: '⏱️',
    });
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }, 2000);
    return;
  } else {
    return (
      <Layout header sidebar sidebarClosed active={1}>
        <div className={styles.container}>
          <div className={styles.successContainer}>{View}</div>
          <h1>Meus parabéns, você concluiu o exame com sucesso!</h1>
          {showScore ? (
            <p>
              Seu exame foi enviado para correção, em breve você terá acesso a
              sua pontuação.
            </p>
          ) : (
            <p>
              Seu exame foi enviado para correção, aguarde um retorno do
              responsável.
            </p>
          )}
          <Link href={'/results'}>Ir para página de resultados</Link>
        </div>
      </Layout>
    );
  }
};

export default CompletionPage;
