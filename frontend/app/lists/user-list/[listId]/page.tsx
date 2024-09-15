import React from 'react'
import ListPage from '@/components/Materials/UserLists/ListPage'
import Layout from '@/components/Elements/Layout'
import classes from './classes.module.scss'

export default function page() {
  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <ListPage />
      </div>
    </Layout>
  )
}
