import Layout from '@/components/Elements/Layout'
import React from 'react'
import classes from './classes.module.scss'
import { CreateOrUpdateListForm } from '@/components/Elements/Forms/CreateOrUpdateListForm'

export default async function CreateList() {
  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <div className={classes['content']}>
          <h2 className={classes['subtitle']}>Créer une liste</h2>
          <CreateOrUpdateListForm mode="create" />
        </div>
      </div>
    </Layout>
  )
}
