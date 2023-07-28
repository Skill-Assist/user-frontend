import Layout from "@/components/layout";
import { useRouter } from "next/router";

import styles from "./styles.module.scss";

const ReportPage = () => {
  const router = useRouter();

  const fetchDatas = async () => {

  }

  return (
    <Layout header headerTitle="" sidebar active={10}>
      <div className={styles.container}>
        <header>
          <div className={styles.infos}>

          </div>
        </header>
      </div>
    </Layout>
  );
};

export default ReportPage;
