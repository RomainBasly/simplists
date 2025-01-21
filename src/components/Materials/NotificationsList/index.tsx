'use client'
import React, { useState, useCallback } from 'react'
import SingleNotification from './SingleNotification'
import classes from './classes.module.scss'

import { sortByDateAndByType } from '@/components/Utils/common'
import { useRouter } from 'next/navigation'
import {
  handleDeleteNotification,
  handleNotificationStatusChange,
} from '@/components/Utils/useNotificationListManipulation'
import { useNotificationsContext } from '@/components/providers/notifications-provider'

export default function NotificationsList() {
  const [itemBeingRemoved, setItemBeingRemoved] = useState<number | null>(null)
  const router = useRouter()

  const {
    notificationsList,
    setNotificationsList,
    liveNotificationNumber,
  } = useNotificationsContext()

  // TODO - connect to a socket hook and its methods

  const onDelete = useCallback(
    async (notificationId: number) => {
      setItemBeingRemoved(notificationId)

      const response = await handleDeleteNotification(notificationId)

      if (response.success) {
        // The setTimeOut is for the css animation, otherwise the prop does not have the time to go to the component

        setTimeout(() => {
          setNotificationsList((previous) => {
            const newList = previous?.filter(
              (notification) => notificationId !== notification.id,
            )
            return newList
          })

          setItemBeingRemoved(null)
        }, 500)
      }
    },
    [setNotificationsList],
  )

  const onMarkAsRead = useCallback(
    async (notificationId: number, isNew: boolean) => {
      const response = await handleNotificationStatusChange(
        notificationId,
        isNew,
      )
      if (response.success) {
        setTimeout(() => {
          setNotificationsList((previous) => {
            const notificationsUpdated = previous?.map((notification) => {
              if (notificationId === notification.id) {
                const notificationUpdated = {
                  ...notification,
                  isNew: !notification.isNew,
                  updated_at: new Date().toISOString(),
                }
                return notificationUpdated
              }
              return notification
            })
            return sortByDateAndByType(notificationsUpdated)
          })
        }, 500)
      }
    },
    [setNotificationsList],
  )

  const onRootClick = useCallback(
    (url: string) => {
      router.push(url)
    },
    [router],
  )

  return (
    <div className={classes['root']}>
      <h2 className={classes['title']}>
        Notifications ({liveNotificationNumber})
      </h2>
      {notificationsList?.map((notification) => {
        return (
          <SingleNotification
            key={notification.id}
            notification={notification}
            onDelete={onDelete}
            onMarkAsRead={onMarkAsRead}
            animateSuppressionByNotificationId={
              itemBeingRemoved === notification.id
            }
            onRootClick={onRootClick}
          />
        )
      })}
    </div>
  )
}
