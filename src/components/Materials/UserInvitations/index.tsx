'use client'
import React, { useState } from 'react'
import InvitationCard from './InvitationCard'
import classes from './classes.module.scss'
import { useRouter } from 'next/navigation'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { useInvitationsInfo } from '@/components/providers/invitations-provider'
import { UseCheckAccessTokenHealth } from '@/components/hooks/Token/checkAccessTokenHealth'

export type IInvitation = {
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
  const {
    pendingInvitations,
    refusedInvitations,
    setPendingInvitations,
    setRefusedInvitations,
  } = useInvitationsInfo()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { checkToken } = UseCheckAccessTokenHealth()
  const router = useRouter()

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
        <h2 className={classes['title']}>
          Invitations reçues en attente de réponse ({pendingInvitations.length})
        </h2>
        {pendingInvitations.length === 0 ? (
          <div className={classes['no-invitation']}>
            <div className={classes['svg']}>{<InformationCircleIcon />}</div>
            <div className={classes['text-content']}>
              Pas de nouvelles invitations
            </div>
          </div>
        ) : (
          pendingInvitations.map((invitation) => (
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
      </div>
      <div className={classes['refused-invitations-section']}>
        {refusedInvitations.length > 0 && (
          <div className={classes['refused-invitations-container']}>
            <h2 className={classes['title']}>
              Invitations envoyées et refusées ({refusedInvitations.length})
            </h2>
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
      </div>
    </div>
  )
}
