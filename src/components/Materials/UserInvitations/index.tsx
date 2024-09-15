'use client'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import InvitationCard from './InvitationCard'
import classes from './classes.module.scss'
import { useRouter } from 'next/navigation'
// import { useAuthInitialization } from '@/components/hooks/useAuthInitialization'
// import { useTokenRefresh } from '@/components/hooks/useTokenRefresh'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { getSocket } from '@/components/Elements/Socket'
import { useCheckAccessTokenHealth } from '@/components/Utils/checkAccessTokenHealth'

type IInvitation = {
  id: string
  list_id: string
  user_id: number
  status: number
  'app-lists': {
    listName: string
    description: string
    thematic: string
  }
  'app-users': {
    email: string
    userName: string
  }
}

export default function UserInvitations() {
  const [pendingInvitations, setPendingInvitations] = useState<IInvitation[]>(
    [],
  )
  const [refusedInvitations, setRefusedInvitations] = useState<IInvitation[]>(
    [],
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const socket = getSocket()
  const { checkToken } = useCheckAccessTokenHealth()
  const router = useRouter()

  useEffect(() => {
    if (socket) {
      socket.on('list-invitation-socket', (packet: any) => {
        const newInvitationThroughSocket = {
          id: packet.data.id as string,
          list_id: packet.data.listId as string,
          user_id: packet.data.userId as number,
          status: packet.data.status as number,
          'app-lists': {
            listName: packet.data.listName as string,
            description: packet.data.listDescription as string,
            thematic: packet.data.thematic as string,
          },
          'app-users': {
            email: packet.data.creatorEmail as string,
            userName: packet.data.creatorUserName as string,
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
        socket.off('list-invitation-socket')
      }
    }
  }, [socket, pendingInvitations])

  const fetchPendingInvitations = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      // This part of the setCookies is essential to propagate the token to the next request I am about to do
      // TODO : see if we can do it differently later
      const status = 1
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
      setLoading(false)
    } catch (error) {
      console.error('Error fetching invitations:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
      setLoading(false)
    }
  }, [router, checkToken])

  useEffect(() => {
    fetchPendingInvitations()
  }, [fetchPendingInvitations])

  const fetchRefusedInvitations = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      // This part of the setCookies is essential to propagate the token to the next request I am about to do
      // TODO : see if we can do it differently later

      const status = 3

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
      setLoading(false)
    } catch (error) {
      console.error('Error fetching invitations:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
      setLoading(false)
    }
  }, [router, checkToken])

  useEffect(() => {
    fetchRefusedInvitations()
  }, [fetchRefusedInvitations])

  if (error) return <div>Error: {error}</div>

  async function handleInvitationStatus(
    invitationId: string,
    listId: string,
    status: number,
    isChangingItsMind: boolean,
  ) {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      const response = await fetch(`/api/lists/handleInvitationStatus/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ invitationId, listId, status }),
      })
      if (!response.ok) {
        throw new Error('Failed to modify invitation')
      }
      const newList = pendingInvitations.filter(
        (invitation) => invitation.id !== invitationId,
      )
      if (isChangingItsMind) {
        setRefusedInvitations(newList)
      } else {
        setPendingInvitations(newList)
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  async function sendInvitationOnStatusChange(
    invitationId: string,
    listId: string,
    status: number,
    isChangingItsMind: boolean,
  ) {
    return handleInvitationStatus(
      invitationId,
      listId,
      status,
      isChangingItsMind,
    )
  }

  return (
    <div className={classes['root']}>
      <div className={classes['pending-invitations-section']}>
        <h2>Invitations reçues en attente de réponse ({pendingInvitations.length})</h2>
        <Suspense fallback={'Loading...'}>
          {pendingInvitations.length === 0 ? (
            <div className={classes['no-invitation']}>
              <div className={classes['svg']}>{<InformationCircleIcon />}</div>
              <div className={classes['text-content']}>
                Pas de nouvelles invitations
              </div>
            </div>
          ) : (
            pendingInvitations.map(async (invitation) => (
              <InvitationCard
                key={parseInt(invitation.id)}
                listName={invitation['app-lists'].listName}
                listId={invitation.list_id}
                creatorName={invitation['app-users'].userName}
                description={invitation['app-lists'].description}
                creatorEmail={invitation['app-users'].email}
                onAccept={() =>
                  sendInvitationOnStatusChange(
                    invitation.id,
                    invitation.list_id,
                    2,
                    false,
                  )
                }
                thematic={invitation['app-lists'].thematic}
                onRefuse={() =>
                  sendInvitationOnStatusChange(
                    invitation.id,
                    invitation.list_id,
                    3,
                    false,
                  )
                }
                invitationId={invitation.id}
              ></InvitationCard>
            ))
          )}
        </Suspense>
      </div>
      <div className={classes['refused-invitations-section']}>
        <Suspense>
          {refusedInvitations.length > 0 && (
            <div className={classes['refused-invitations-container']}>
              <h2>Invitations envoyées et refusées ({refusedInvitations.length})</h2>
              {refusedInvitations.map(async (invitation) => (
                <InvitationCard
                  key={parseInt(invitation.id)}
                  listName={invitation['app-lists'].listName}
                  listId={invitation.list_id}
                  creatorName={invitation['app-users'].userName}
                  description={invitation['app-lists'].description}
                  creatorEmail={invitation['app-users'].email}
                  onAccept={() =>
                    sendInvitationOnStatusChange(
                      invitation.id,
                      invitation.list_id,
                      2,
                      true,
                    )
                  }
                  thematic={invitation['app-lists'].thematic}
                  invitationId={invitation.id}
                  isMasked={true}
                  acceptButtonText={"Changer d'avis et accepter"}
                ></InvitationCard>
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
