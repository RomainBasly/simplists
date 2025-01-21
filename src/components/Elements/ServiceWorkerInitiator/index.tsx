'use client'
import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { getSocket } from '../Socket'
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../../../types/types'
import { convertUrlBase64ToUint8Array } from '@/components/Helpers'
import { subscribeToNotifications } from '@/components/Utils/common'

export default function ServiceWorkerInitiator() {
  useEffect(() => {
    try {
      const registerServiceWorkerAndWebsocketMessages = async () => {
        if (typeof window !== 'undefined') {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(
              function (registration) {
                console.log(
                  'Service Worker registration successful with scope: ',
                  registration.scope,
                )
              },
              function (err) {
                console.log('Service Worker registration failed: ', err)
              },
            )
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.action === 'reinitializeWebSocket') {
                const socket = getSocket()
                if (!socket.connected) {
                  socket.connect()
                }
              }
            })
          }
        }
      }
      registerServiceWorkerAndWebsocketMessages()
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    // As the socket can get disconnected after a certain period,
    // we need to reconnect it to receive modifications made by the other participants
    const checkAndReconnectSocket = async () => {
      const socket = getSocket()

      try {
        await testServerConnection(socket)
        console.log('Server connection is active')
      } catch (error) {
        console.log('Server connection failed, reconnecting...', error)
        // Attempt to reconnect
        if (socket.connected) {
          socket.disconnect()
          localStorage.removeItem('socketId')
        }
        socket.connect()
      }
    }

    // Event listener for when the tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (navigator.onLine) {
          checkAndReconnectSocket()
        }
      }
    }

    const testServerConnection = (
      socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    ) => {
      return new Promise((resolve, reject) => {
        // Set a timeout for the test
        const timeout = setTimeout(() => {
          reject(new Error('Response timeout'))
        }, 60000) // 60 seconds timeout

        socket.once('pong', () => {
          clearTimeout(timeout)
          resolve(true)
        })

        socket.emit('ping')
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', checkAndReconnectSocket) // Reconnect when coming back online

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', checkAndReconnectSocket)
    }
  }, [])

  useEffect(() => {
    const checkIfNotificationsAreGranted = async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          const registration = await navigator.serviceWorker.ready
          const userAgent = navigator.userAgent
          const existingSubscription = await registration.pushManager.getSubscription()

          if (existingSubscription) {
            subscribeToNotifications(
              '/api/notifications/update',
              existingSubscription,
              userAgent,
            )
          } else {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertUrlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              ),
            })

            try {
              subscribeToNotifications(
                '/api/notifications/subscribe',
                subscription,
                userAgent,
              )
            } catch (error) {
              console.error(
                'Error updating the notification subscription in service worker initiator',
                error,
              )
            }
          }
        }
      }
    }

    checkIfNotificationsAreGranted()
  }, [])
  return <></>
}
