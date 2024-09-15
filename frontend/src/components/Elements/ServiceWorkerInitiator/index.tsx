'use client'
import React, { useEffect } from 'react'
// import { getSocket } from '../Socket'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { Socket } from 'socket.io-client'
import { getSocket } from '../Socket'

export default function ServiceWorkerInitiator() {
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    // Function to check and (re)connect the socket
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
      socket: Socket<DefaultEventsMap, DefaultEventsMap>,
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
  return <></>
}
