import React from 'react'

import styles from './styles.module.scss'
import Layout from '@/components/layout'

const Results: React.FC = () => {
  return (
    <div className={styles.container}>
      <Layout sidebar footer header headerTitle='Seus Resultados' active={3}>
        <div>Results</div>
      </Layout>
    </div>
  )
}

export default Results