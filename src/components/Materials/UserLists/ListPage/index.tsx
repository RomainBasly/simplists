'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import classes from './classes.module.scss'
// import { useAuthInitialization } from '@/components/hooks/useAuthInitialization'
import StorageService from '@/Services/CookieService'
import ListCard from '../ListCard'
import { ListStatus } from '../../../../../types'
import LoadingMaterial from '../../LoadingMaterial'
import DynamicButtonInput from '../../Button/AddListElementButton'
import { sortItemObjectByUpdatedDateDSC } from '@/components/Helpers'
import ListElement from './ListElement'
import { getSocket } from '@/components/Elements/Socket'
import useTokenService from '@/components/Utils/tokenService'
import { useCheckAccessTokenHealth } from '@/components/Utils/checkAccessTokenHealth'

type IResponse = IList[]

export type IList = {
  'app-lists': IListContent
}
export type IListContent = {
  id: string
  listName: string
  thematic: string
  description: string
  beneficiaries: IBeneficiary[]
  items: IElement[]
}

export type IBeneficiary = {
  'app-users': IUser
}

export type IUser = {
  userName: string
  user_id: string
}

export type IElement = {
  id: string
  updated_at: string
  content: string
  statusOpen: boolean
}

export default function ListPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [animateSuppressionByItemId, setAnimateSuppressionByItemId] = useState<
    string | null
  >(null)
  const [listTop, setListTop] = useState<IList | null>(null)
  const [listItems, setListItems] = useState<IElement[] | null>(null)
  const router = useRouter()
  const paramsInitiator = useParams()
  const listId = paramsInitiator?.listId as string | undefined
  const socket = getSocket()
  const { checkToken } = useCheckAccessTokenHealth()

  const fetchListData = useCallback(async () => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      const response = await fetch(`/api/lists/getListItems?listId=${listId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch lists items')
      }
      const data: IResponse = await response.json()

      if (data) {
        if (data[0]['app-lists'].items) {
          const LIVE = data[0]['app-lists'].items
            .filter((item) => item.statusOpen === true)
            .sort(sortItemObjectByUpdatedDateDSC)
          const CROSSED = data[0]['app-lists'].items
            .filter((item) => item.statusOpen === false)
            .sort(sortItemObjectByUpdatedDateDSC)

          const sortedItems = [...LIVE, ...CROSSED]
          setListItems(sortedItems)
        }

        const topElements: IList = {
          ...data[0],
          'app-lists': {
            ...data[0]['app-lists'],
          },
        }
        setListTop(topElements)
        setLoading(false)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching list items:', error)
      if (error instanceof Error) {
        setError(error.message)
      }
      setLoading(false)
      router.push('/')
      // prévoir le cas où ce n'est pas où la personne n'est pas autorisée
    }
  }, [router, checkToken, listId])

  useEffect(() => {
    if (listId) {
      fetchListData()
    }
  }, [listId, fetchListData])

  useEffect(() => {
    if (socket) {
      socket.on('adding-item-to-list-socket', (packet: any) => {
        if (listItems) {
          const updatedItems = [...listItems, packet.elementToPass[0]]
          const sortedElements = updatedItems.sort(
            sortItemObjectByUpdatedDateDSC,
          )
          setListItems(sortedElements)
        } else {
          setListItems(packet.elementToPass[0])
        }
      })
      socket.on(
        'suppress-item-from-list-socket',
        (packet: { elementId: string }) => {
          if (listItems) {
            const updatedItems = listItems.filter(
              (element) => element.id !== packet.elementId,
            )
            setTimeout(() => {
              setListItems(updatedItems)
              setAnimateSuppressionByItemId(null)
            }, 700)
          } else {
            setListItems(null)
          }
        },
      )
      socket.on('change-item-status-socket', (packet: any) => {
        // TODO : refacto the way I transform the data before displaying it
        if (listItems) {
          const filteredList = listItems.filter(
            (element) => element.id !== packet.elementToPass[0].id,
          )
          const updatedListUnsorted = [...filteredList, packet.elementToPass[0]]
          const newLiveElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === true)
            .sort(sortItemObjectByUpdatedDateDSC)
          const newCrossedElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === false)
            .sort(sortItemObjectByUpdatedDateDSC)

          const newListElements = [
            ...newLiveElementsSorted,
            ...newCrossedElementsSorted,
          ]
          setListItems(newListElements)
        } else {
          setListItems(null)
        }
      })
      socket.on('update-item-content-socket', (packet: any) => {
        // TODO : refacto the way I transform the data before displaying it
        if (listItems) {
          const filteredList = listItems.filter(
            (element) => element.id !== packet.elementToPass[0].id,
          )
          const updatedListUnsorted = [...filteredList, packet.elementToPass[0]]
          const newLiveElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === true)
            .sort(sortItemObjectByUpdatedDateDSC)
          const newCrossedElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === false)
            .sort(sortItemObjectByUpdatedDateDSC)

          const newListElements = [
            ...newLiveElementsSorted,
            ...newCrossedElementsSorted,
          ]
          setListItems(newListElements)
        } else {
          setListItems(null)
        }
      })
    }
  }, [socket, listItems])

  if (!listTop) {
    return (
      <div className={classes['root']}>
        <div className={classes['loading']}>
          <LoadingMaterial />
          Loading...
        </div>
      </div>
    )
  }

  const beneficiaries: IBeneficiary[] = listTop['app-lists'].beneficiaries

  const addItemToList = async (
    inputElement: string,
  ): Promise<boolean | null> => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return null
      }
      const response = await fetch(`/api/lists/addItemToList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ listId, content: inputElement, beneficiaries }),
      })
      const result = await response.json()

      if (listItems) {
        const updatedListUnsorted = [...listItems, result.itemAdded[0]]
        const liveElementsSorted = updatedListUnsorted
          .filter((item) => item.statusOpen === true)
          .sort(sortItemObjectByUpdatedDateDSC)
        const crossedElementsSorted = updatedListUnsorted
          .filter((item) => item.statusOpen === false)
          .sort(sortItemObjectByUpdatedDateDSC)

        const updatedItems = [...liveElementsSorted, ...crossedElementsSorted]
        setListItems(updatedItems)
      } else {
        setListItems(result.itemAdded)
      }

      if (!response.ok) {
        throw new Error('Failed to post item to list')
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  const updateElement = async (
    updatedContent: string,
    elementId?: string,
    onSuccess?: () => void,
  ): Promise<boolean | null> => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return null
      }
      const response = await fetch(`/api/lists/updateListElement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          listId,
          elementId,
          contentUpdate: updatedContent.trim(),
          beneficiaries,
        }),
      })
      const result = await response.json()
      // TODO : refacto the way I transform the data before displaying it
      if (elementId && listItems) {
        const otherElements = listItems.filter(
          (element) => element.id !== elementId,
        )
        const newElement = result.data.itemContentChanged[0]
        const mergeElements = [...otherElements, newElement]

        const newLiveElementsSorted = mergeElements
          .filter((item) => item.statusOpen === true)
          .sort(sortItemObjectByUpdatedDateDSC)
        const newCrossedElementsSorted = mergeElements
          .filter((item) => item.statusOpen === false)
          .sort(sortItemObjectByUpdatedDateDSC)

        const newElements = [
          ...newLiveElementsSorted,
          ...newCrossedElementsSorted,
        ]
        if (onSuccess) {
          onSuccess()
        }
        setListItems(newElements)
      }

      if (!response.ok) {
        throw new Error('Failed to modify item to list')
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const suppressElement = async (id: string): Promise<boolean | null> => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return null
      }
      const response = await fetch(`/api/lists/suppressItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ listId, elementId: id, beneficiaries }),
      })
      if (response.status === 200) {
        setAnimateSuppressionByItemId(id)
        setTimeout(() => {
          if (listItems) {
            const newList = listItems.filter((item) => item.id !== id)
            setListItems(newList)
            setAnimateSuppressionByItemId(null)
          }
        }, 700)
      }
      return true
    } catch (error) {
      return false
    }
  }

  const fetchItemStatusChange = async (
    listId: string,
    id: string,
    statusOpen: boolean,
    beneficiaries: IBeneficiary[],
  ) => {
    const token = await checkToken()
    if (!token) {
      setLoading(false)
      router.push('/login')
      return null
    }
    const response = await fetch('/api/lists/handleItemStatusChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        listId,
        elementId: id,
        statusOpen: statusOpen,
        beneficiaries,
      }),
    })
    return response.json()
  }

  const transformListItems = (
    id: string,
    responseData: any,
    listItems: IElement[],
  ) => {
    const otherElements = listItems.filter((element) => element.id !== id)

    const isArray = Array.isArray(otherElements)
    const hasLength = otherElements.length > 0

    if (isArray && hasLength) {
      if (Array.isArray(responseData.data.itemStatusChanged)) {
        const updatedListNotSorted = [
          ...responseData.data.itemStatusChanged,
          ...otherElements,
        ]
        const newLiveElementsSorted = updatedListNotSorted
          .filter((item) => item.statusOpen === true)
          .sort(sortItemObjectByUpdatedDateDSC)

        const newCrossedElementsSorted = updatedListNotSorted
          .filter((item) => item.statusOpen === false)
          .sort(sortItemObjectByUpdatedDateDSC)

        const newElements = [
          ...newLiveElementsSorted,
          ...newCrossedElementsSorted,
        ]
        return newElements
      } else {
        console.error('responseData.data.itemStatusChanged is not an array')
        return null
      }
    } else if (isArray && !hasLength) {
      const updatedListNotSorted = [...responseData.data.itemStatusChanged]
      const newLiveElementsSorted = updatedListNotSorted
        .filter((item) => item.statusOpen === true)
        .sort(sortItemObjectByUpdatedDateDSC)

      const newCrossedElementsSorted = updatedListNotSorted
        .filter((item) => item.statusOpen === false)
        .sort(sortItemObjectByUpdatedDateDSC)

      const newElements = [
        ...newLiveElementsSorted,
        ...newCrossedElementsSorted,
      ]
      return newElements
    } else {
      console.error('otherElements is not an array or is empty')
      return null
    }
  }

  const handleElementStatusChange = async (id: string, statusOpen: boolean) => {
    try {
      const token = await checkToken()
      if (!token) {
        setLoading(false)
        router.push('/login')
        return null
      }
      if (listId) {
        const responseData = await fetchItemStatusChange(
          listId,
          id,
          !statusOpen,
          beneficiaries,
        )

        if (!Array.isArray(listItems)) {
          console.error('listItems is not an array:', listItems)
          return false
        }

        const newElements = transformListItems(id, responseData, listItems)

        if (newElements) {
          setListItems(newElements)
        }
      }
      return true
    } catch (error) {
      console.error('Error:', error)
      return false
    }
  }

  const listDetails = listTop['app-lists']

  return (
    <div className={classes['root']}>
      <div className={classes['list-item']}>
        <div className={classes['element']} key={listDetails.id}>
          <ListCard
            id={listDetails.id}
            listName={listDetails.listName}
            thematic={listDetails.thematic}
            beneficiaries={listDetails.beneficiaries.map(
              (beneficiary) => beneficiary,
            )}
            description={listDetails.description}
          />
        </div>
      </div>
      <div className={classes['elements-container']}>
        {listItems?.map((element) => {
          return (
            <ListElement
              content={element.content}
              key={element.id}
              onCrossElement={handleElementStatusChange}
              onElementSuppress={suppressElement}
              id={element.id}
              animateSuppressionByItemId={
                animateSuppressionByItemId === element.id
              }
              statusOpen={element.statusOpen}
              onInputSubmit={updateElement}
            />
          )
        })}
      </div>
      <div className={classes['dynamic-button-input']}>
        <DynamicButtonInput onInputSubmit={addItemToList} />
      </div>
    </div>
  )
}
