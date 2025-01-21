'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { IInvitation } from '../Materials/UserInvitations'
import { getSocket } from '../Elements/Socket'

type InvitationContextType = {
  pendingInvitations: IInvitation[]
  refusedInvitations: IInvitation[]
  setPendingInvitations: React.Dispatch<React.SetStateAction<IInvitation[]>>
  setRefusedInvitations: React.Dispatch<React.SetStateAction<IInvitation[]>>
  error: string
  invitationsNotificationsNumber: number
}

const InvitationContext = createContext<InvitationContextType | null>(null)

export const useInvitationsInfo = () => {
  const context = useContext(InvitationContext)
  if (!context) {
    throw new Error(
      'useInvitationsInfo must be used inside an <InvitationsInfoProvider/>',
    )
  }
  return context
}

export const InvitationsInfoProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [pendingInvitations, setPendingInvitations] = useState<IInvitation[]>(
    [],
  )
  const [refusedInvitations, setRefusedInvitations] = useState<IInvitation[]>(
    [],
  )
  const [
    invitationsNotificationsNumber,
    setInvitationsNotificationsNumber,
  ] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const socket = getSocket()

  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        const status = 1 // pending invitations
        const response = await fetch(
          `/api/lists/getInvitations?status=${status}`,
          {
            credentials: 'include',
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch invitations')
        }

        const data = await response.json()
        setPendingInvitations(data)
        setInvitationsNotificationsNumber(data.length)
      } catch (error) {
        console.error('Error fetching invitations:', error)
        if (error instanceof Error) {
          setError(error.message)
        }
      }
    }

    fetchPendingInvitations()
  }, [])

  useEffect(() => {
    const fetchRefusedInvitations = async () => {
      try {
        const status = 3 // refused invitations
        const response = await fetch(
          `/api/lists/getInvitations?status=${status}`,
          {
            credentials: 'include',
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch invitations')
        }

        const data = await response.json()
        setRefusedInvitations(data)
      } catch (error) {
        console.error('Error fetching invitations:', error)
        if (error instanceof Error) {
          setError(error.message)
        }
      }
    }

    fetchRefusedInvitations()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('list_creation', (data: any) => {
        const { payload } = data.payload
        const newInvitationThroughSocket = {
          id: payload.id as string,
          list_id: payload.listId as string,
          user_id: payload.userId as number,
          status: payload.status as number,
          'app-lists': {
            listName: payload.listName as string,
            description: payload.listDescription as string,
            thematic: payload.thematic as string,
          },
          'app-users': {
            email: payload.creatorEmail as string,
            userName: payload.creatorUserName as string,
          },
        }

        const totalInvitations = pendingInvitations.toSpliced(
          0,
          0,
          newInvitationThroughSocket,
        )

        setPendingInvitations(totalInvitations)
      })

      return () => {
        socket.off('list_creation')
      }
    }
  }, [socket, pendingInvitations])

  const contextValue = useMemo(
    () => ({
      pendingInvitations,
      refusedInvitations,
      error,
      setPendingInvitations,
      setRefusedInvitations,
      invitationsNotificationsNumber,
    }),
    [
      pendingInvitations,
      refusedInvitations,
      error,
      invitationsNotificationsNumber,
    ],
  )

  return (
    <InvitationContext.Provider value={contextValue}>
      {children}
    </InvitationContext.Provider>
  )
}
