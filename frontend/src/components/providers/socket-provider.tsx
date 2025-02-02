'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { getSocket } from '../Elements/Socket'

type SocketContextType = {
  isConnected: boolean
  listAttributes: {
    listId: number | null
    listName?: string
    author?: string
    description?: string
  }
}

type IListAttribute = {
  listId: number | null
  listName?: string
  author?: string
  description?: string
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  listAttributes: {
    listId: null,
    listName: '',
    author: '',
    description: '',
  },
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [listAttributes, setListAttributes] = useState<IListAttribute>({
    listId: null,
    listName: '',
    author: '',
    description: '',
  })

  useEffect(() => {
    const socket = getSocket()

    socket.on('connect', () => {
      console.log('Connected to socket server')
      setIsConnected(true) // Update state to indicate the socket is connected
    })

    // Listen for when the connection to the server is disconnected
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setIsConnected(false) // Update state to indicate the socket is disconnected
    })

    const assignId = (data: { socketId: string }) => {
      localStorage.setItem('socketId', data.socketId)
      const accessToken = Cookies.get('accessToken')
      socket.emit('register-user-id', {
        socketId: localStorage.getItem('socketId'),
        accessToken,
      })
    }

    socket.on('assign-socket-id', assignId)
  }, [])

  const contextValue = useMemo(() => ({ isConnected, listAttributes }), [
    listAttributes,
    isConnected,
  ])

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}
