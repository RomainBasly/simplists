import React, { useState } from 'react'
import classes from './classes.module.scss'
import Button from '@/components/Materials/Button'
import { convertUrlBase64ToUint8Array } from '@/components/Helpers'

import { HandThumbUpIcon, HandRaisedIcon } from '@heroicons/react/24/solid'
import { subscribeToNotifications } from '@/components/Utils/common'
import { UseCheckAccessTokenHealth } from '@/components/hooks/Token/checkAccessTokenHealth'

type IProps = {
  onPreferenceChange: () => void
}

const AskForPushNotificationsPreferences = React.memo(
  function AskForPushNotificationsPreferences(props: IProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [status, setStatus] = useState<string>('pending')
    const [subscription, setSubscription] = useState<PushSubscription | null>(
      null,
    )
    const { checkToken } = UseCheckAccessTokenHealth()

    const subscribeUser = async () => {
      const registration = await navigator.serviceWorker.ready
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertUrlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          ),
        })

        const userAgent = navigator.userAgent
        return { subscription, userAgent }
      } catch (error) {
        console.error(error)
      }
    }

    const requestNotificationPermissions = async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await Notification.requestPermission()
        const userAgent = navigator.userAgent
        if (permission === 'granted') {
          const subscription = await subscribeUser()
          setStatus('accepted')
          if (subscription) {
            setSubscription(subscription.subscription)
          }
          acceptOrDenyNotifications(
            'accept',
            subscription?.subscription,
            userAgent,
          )
        } else if (permission === 'denied') {
          acceptOrDenyNotifications('denied')
        }
      }
    }

    const acceptOrDenyNotifications = async (
      status: string,
      subscription?: PushSubscription,
      userAgent?: string,
    ) => {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setStatus(status)

        if (subscription && userAgent) {
          const response = await subscribeToNotifications(
            '/api/notifications/subscribe',
            subscription,
            userAgent,
          )
          if (response) {
            props.onPreferenceChange()
          }
        }
      } catch (error) {
        console.error('Error updating the notification subscription', error)
        setLoading(false)
      }
    }

    return (
      <div className={classes['root']}>
        <div className={classes['text']}>
          Souhaitez-vous autoriser les notifications push? Cela vous permettra
          d'être informé(e) en temps réel des actions de vos proches sur
          l'application.
        </div>
        <div className={classes['buttons-container']}>
          <Button
            text={'Accepter ou refuser les notifications'}
            className={classes['accept-button']}
            onClick={requestNotificationPermissions}
            leftIcon={<HandThumbUpIcon />}
          />
        </div>
      </div>
    )
  },
)

export default AskForPushNotificationsPreferences
