import React from 'react'

import styles from './styles.module.scss'
import Layout from '@/components/layout'

const Help: React.FC = () => {
  return (
    <div className={styles.container}>
      <Layout sidebar footer active={2}>
        <div>Help</div>
      </Layout>
    </div>
  )
}

export default Help