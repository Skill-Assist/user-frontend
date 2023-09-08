import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { AiOutlineCloseCircle, AiOutlinePlus } from 'react-icons/ai';
import { BiBookOpen } from 'react-icons/bi';
import cookie from 'react-cookies';
import { TailSpin } from 'react-loader-spinner';

import Layout from '@/components/layout';

import userService from '@/services/userService';

import { User } from '@/types/user';

import styles from './styles.module.scss';

const Home = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [showAnnouncement, setShowAnnouncement] = useState('true');

  const fetchUser = async () => {
    const response = await userService.getProfile();

    if (response.status >= 200 && response.status < 300) {
      setUser(response.data);
      setPageLoading(false);
    } else {
      toast.error('Erro ao buscar usuário!');
      setPageLoading(false);
    }
  };

  const data = {
    slides: [
      {
        icon: 'ai.svg',
        id: 'ai',
        title: 'Elaboração',
        copy: 'Elaboração de questões por meio do uso de IA',
      },
      {
        icon: 'proctoring.svg',
        id: 'proctoring',
        title: 'Correção',
        copy: 'Provas com correção automatizada por IA',
      },
      {
        icon: 'automation.svg',
        id: 'automation',
        title: 'Setup customizado',
        copy: 'Configuração personalizada de acordo com o que for necessário',
      },
      {
        icon: 'feedback.svg',
        id: 'feedback',
        title: 'Feedback',
        copy: 'Dashboard com insights do resultado do candidato.',
      },
      {
        icon: 'curva.svg',
        id: 'curva',
        title: 'Comparação Global',
        copy: 'Notas distribuidas de acordo com os pares.',
      },
      {
        icon: 'setup.svg',
        id: 'setup.svg',
        title: 'Anti-Fraude',
        copy: 'Monitoramente do candidato durante a prova.',
      },
    ],
  };

  useEffect(() => {
    const showAnnouncementCookie = cookie.load(
      'show_skill_assist_announcement'
    );
    if (showAnnouncementCookie === 'false') {
      setShowAnnouncement('false');
    } else {
      setShowAnnouncement('true');
    }

    fetchUser();
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
  } else if (!user) {
    cookie.remove('token');
    toast.error('Sua sessão expirou. Faça login novamente', {
      icon: '⏱️',
    });
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }, 2000);
    return;
  } else
    return (
      <Layout sidebar header headerTitle="Dashboard" active={0}>
        <div className={styles.container}>
          <div className={styles.introContainer}>
            <h1>
              Olá, <span>{user.name}</span>
            </h1>
            <h2>
              Seja muito bem vindo(a) à <span>Skill Assist</span>
            </h2>
            <div>
              <button
                onClick={() => {
                  toast.loading('Feature em desenvolvimento', {
                    duration: 3000,
                    position: 'top-right',
                  });
                }}
              >
                <BiBookOpen />
                Tutoriais
              </button>
            </div>
          </div>
          {/* {showAnnouncement === 'true' && (
            <div className={styles.announcementContainer}>
              <AiOutlineCloseCircle
                size={25}
                onClick={() => {
                  cookie.save('show_skill_assist_announcement', 'false', {
                    domain: `${process.env.NEXT_PUBLIC_COOKIE_DOMAIN_URL}`,
                  });
                  setShowAnnouncement('false');
                }}
              />
              Anuncio
            </div>
          )} */}
          <div className={styles.featuresContainer}>
            <h2>Features</h2>
            <ul>
              {data.slides.map((slide, index) => {
                return (
                  <li key={index}>
                    <Image
                      src={`/icons/features/dark/${slide.icon}`}
                      width={50}
                      height={50}
                      alt={slide.id}
                    />
                    <div>
                      <h3>{slide.title}</h3>
                      <p>{slide.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Layout>
    );
};

export default Home;
