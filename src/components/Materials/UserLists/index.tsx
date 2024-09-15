'use client'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import classes from './classes.module.scss'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import ListCard from './ListCard'
// import { useAuthInitialization } from '@/components/hooks/useAuthInitialization'
import StorageService from '@/Services/CookieService'
import { useRouter } from 'next/navigation'
import { IBeneficiary, IListContent } from './ListPage'
import LoadingMaterial from '../LoadingMaterial'
import { sortItemListObjectByNameASC } from '@/components/Helpers'
import { useCheckAccessTokenHealth } from '@/components/Utils/checkAccessTokenHealth'
import Cookies from 'js-cookie'

export type IList = {
  'app-lists': IListContent
}

export type IListElement = {
  id: string
  listName: string
  thematic: string
  description: string
  beneficiaries: IBeneficiary[]
}

export default function UserLists() {
  const [loading, setLoading] = useState(true)
  const [userLists, setUserLists] = useState<IList[]>([])
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const { checkToken } = useCheckAccessTokenHealth()

  const fetchListsByUser = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      const response = await fetch(`/api/lists/getLists`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch lists')
      }
      const data = await response.json()

      const sortedData = [...data].sort(sortItemListObjectByNameASC)

      setUserLists(sortedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching list beneficiaries:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
      setLoading(false)
    }
  }, [router, checkToken])

  useEffect(() => {
    fetchListsByUser()
  }, [fetchListsByUser])

  const handleListClick = (list: IList) => {
    const url = `/lists/user-list/${list['app-lists'].id}`
    router.push(url)
  }

  return (
    <div className={classes['root']}>
      <h2 className={classes['title']}>Mes listes</h2>
      <Suspense fallback={<LoadingMaterial />}>
        {userLists.length === 0 && !loading && (
          <div className={classes['no-invitation']}>
            <div className={classes['svg']}>{<InformationCircleIcon />}</div>
            <div className={classes['text-content']}>
              Vous n'avez pas de liste ou vous êtes hors ligne
            </div>
          </div>
        )}
        {userLists.length > 0 && (
          <div className={classes['user-lists-container']}>
            {userLists.map(async (list, index) => (
              <div
                className={classes['unit']}
                key={index}
                onClick={() => handleListClick(list)}
              >
                <ListCard
                  id={list['app-lists'].id}
                  listName={list['app-lists'].listName}
                  thematic={list['app-lists'].thematic}
                  description={list['app-lists'].description}
                />
              </div>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  )
}
