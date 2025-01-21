'use client'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import classes from './classes.module.scss'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import ListCard from './ListCard'
import { useRouter } from 'next/navigation'

import LoadingMaterial from '../LoadingMaterial'
import { sortItemListObjectByNameASC } from '@/components/Helpers'

import AskForPushNotificationsPreferences from '@/components/Elements/AllowPushNotifications'
import { ErrorBoundary } from 'react-error-boundary'
import {
  IListContent,
  IBeneficiary,
} from '@/components/Elements/Forms/CreateOrUpdateListForm'
import { UseCheckAccessTokenHealth } from '@/components/hooks/Token/checkAccessTokenHealth'

export type IList = {
  'app-lists': IListContent
}

export type IListElement = {
  id: string
  listName: string
  thematic: string
  description: string
  beneficiaries: IBeneficiary[]
}

// Task of this component : fetch lists + display a notification info to display push notification messages or not
export default function UserLists() {
  const [loading, setLoading] = useState(true)
  const [userLists, setUserLists] = useState<IList[]>([])

  // we consider by default that the user has defined Notification Preferences by default - change its to true for production
  const [
    hasDefinedItsNotificationsPreference,
    setHasDefinedItsNotificationsPreference,
  ] = useState<NotificationPermission | boolean>(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const { checkToken } = UseCheckAccessTokenHealth()

  const fetchListsByUser = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      const response = await fetch(`/api/lists/getLists`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch lists')
      }
      const data = await response.json()

      const sortedData = [...data].sort(sortItemListObjectByNameASC)

      setUserLists(sortedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching list beneficiaries:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
      setLoading(false)
    }
  }, [router, checkToken])

  // TODO: Implement a API call to get if the user has already defined its preferences

  useEffect(() => {
    fetchListsByUser()
  }, [fetchListsByUser])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permissions = Notification.permission
      if (permissions === 'default') {
        setHasDefinedItsNotificationsPreference(false)
      } else {
        setHasDefinedItsNotificationsPreference(true)
      }
    }
  }, [])

  const handleListClick = (list: IList) => {
    const url = `/lists/user-list/${list['app-lists'].id}`
    router.push(url)
  }

  const handleNotificationPreferenceChange = () => {
    setHasDefinedItsNotificationsPreference(true)
  }

  return (
    <div className={classes['root']}>
      <ErrorBoundary
        fallbackRender={() => (
          <div>
            Oops! Y'a un poil dans la soupe! Si vous voyez ce message, contactez
            isisetthea@gmail.com et dites lui que le chat a encore trempé la
            patte dans le bol
          </div>
        )}
      ></ErrorBoundary>
      {!hasDefinedItsNotificationsPreference && (
        <div className={classes['allow-notifications-container']}>
          <AskForPushNotificationsPreferences
            onPreferenceChange={handleNotificationPreferenceChange}
          />
        </div>
      )}
      <h2 className={classes['title']}>Mes listes</h2>
      <Suspense fallback={<LoadingMaterial />}>
        {userLists.length === 0 && !loading && (
          <div className={classes['no-invitation']}>
            <div className={classes['svg']}>{<InformationCircleIcon />}</div>
            <div className={classes['text-content']}>
              Vous n'avez pas de liste ou vous êtes hors ligne
            </div>
          </div>
        )}
        {userLists.length > 0 && (
          <div className={classes['user-lists-container']}>
            {userLists.map(async (list, index) => (
              <div
                className={classes['unit']}
                key={index}
                onClick={() => handleListClick(list)}
              >
                <ListCard
                  id={list['app-lists'].id}
                  listName={list['app-lists'].listName}
                  thematic={list['app-lists'].thematic}
                />
              </div>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  )
}
