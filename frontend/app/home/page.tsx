'use server'
import classes from './classes.module.scss'
import Layout from '@/components/Elements/Layout'
import Button from '@/components/Materials/Button'
import { FolderPlusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

import React from 'react'
import UserLists from '@/components/Materials/UserLists'

export default async function Home() {
  //Here is the request I would like to trigger with the accessToken.
  // How then to inject inside this request?

  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <div className={classes['title-container']}></div>
        <UserLists />
        <div className={classes['redirection-button-container']}>
          <Link href="/lists/create-list">
            <Button
              text={'Créer une liste'}
              className={classes['create-list-button']}
              leftIcon={<FolderPlusIcon />}
            />
          </Link>
        </div>
      </div>
    </Layout>
  )
}