'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react'
import { INotificationsList } from '../Materials/NotificationsList/types'
import { UseCheckAccessTokenHealth } from '../hooks/Token/checkAccessTokenHealth'
import { useRouter } from 'next/navigation'
import { sortByDateAndByType } from '../Utils/common'

type NotificationsContextType = {
  notificationsList: INotificationsList
  liveNotificationNumber: number
  setNotificationsList: React.Dispatch<React.SetStateAction<INotificationsList>>
}

const NotificationsContext = createContext<NotificationsContextType>({
  notificationsList: [],
  liveNotificationNumber: 0,
  setNotificationsList: () => {},
})

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notificationsList, setNotificationsList] = useState<
    INotificationsList
  >([])

  const { checkToken } = UseCheckAccessTokenHealth()
  const router = useRouter()

  const liveNotificationNumber = notificationsList.filter(
    (notification) => notification.isNew,
  ).length

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await checkToken()
        if (!token) {
          router.push('/login')
          return
        }
        const response = await fetch(`/api/notifications/get-notifications`, {
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Failed to fetch lists of notifications')
        }
        const data = await response.json()
        const sortedData = sortByDateAndByType(data)
        setNotificationsList(sortedData)
      } catch (err) {
        console.error(err)
      }
    }
    fetchInitialData()
  }, [checkToken, router])

  const contextValue = useMemo(
    () => ({
      liveNotificationNumber,
      notificationsList,
      setNotificationsList,
    }),
    [liveNotificationNumber, notificationsList],
  )

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotificationsContext() {
  return useContext(NotificationsContext)
}
