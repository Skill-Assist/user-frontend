import React from 'react'

import styles from './styles.module.scss'
import Layout from '@/components/layout'

const Results: React.FC = () => {
  return (
    <div className={styles.container}>
      <Layout sidebar footer active={1}>
        <div>Results</div>
      </Layout>
    </div>
  )
}

export default Results