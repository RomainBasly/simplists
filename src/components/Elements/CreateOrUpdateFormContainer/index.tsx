'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useCallback, useState } from 'react'
import {
  CreateOrUpdateListForm,
  IListContent,
} from '../Forms/CreateOrUpdateListForm'
import { useCheckAccessTokenHealth } from '@/components/Utils/checkAccessTokenHealth'
import LoadingMaterial from '@/components/Materials/LoadingMaterial'
import classes from './classes.module.scss'

export default function CreateOrUpdateFormContainer() {
  const router = useRouter()
  const [_, setIsLoading] = useState<boolean>(true)
  const [listDefinition, setListDefinition] = useState<IListContent | null>(
    null,
  )
  const paramsInitiator = useParams()
  const listId = paramsInitiator?.listId as string
  const { checkToken } = useCheckAccessTokenHealth()

  const fetchListDefinition = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        router.push('/login')
        return
      }
      const response = await fetch(
        `/api/lists/getListDefinition?listId=${listId}`,
        {
          credentials: 'include',
        },
      )

      const rawData = await response.json()
      const id = listId
      const {
        thematic,
        listName,
        description,
        access_level,
        invitedEmails,
        beneficiaries,
      } = rawData[0] as IListContent
      const initialData = {
        id,
        thematic,
        listName,
        description,
        access_level,
        invitedEmails,
        beneficiaries,
      }
      setListDefinition(initialData)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch the definition of the list:', error)
      router.push('/')
    }
  }, [listId, checkToken, router])

  useEffect(() => {
    if (listId) {
      fetchListDefinition()
    }
  }, [listId, fetchListDefinition])

  if (listDefinition) {
    return <CreateOrUpdateListForm mode="edit" initialData={listDefinition} />
  }

  return (
    <div className={classes['root']}>
      <div className={classes['loader-content']}>
        <LoadingMaterial />
        <p className={classes['charge']}>Chargement en cours...</p>
      </div>
      <p className={classes['blocked']}>
        Si vous êtes bloqués ici, rafraîchissez votre page
      </p>
    </div>
  )
}
