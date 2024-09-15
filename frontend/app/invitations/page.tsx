import Layout from '@/components/Elements/Layout'
import UserInvitations from '@/components/Materials/UserInvitations'
import React from 'react'
import classes from './classes.module.scss'

export default function UserInvitationsPage() {
  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <UserInvitations />
      </div>
    </Layout>
  )
}
