'use client'
import React, { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import classes from './classes.module.scss'
import ListCard from '../ListCard'
import LoadingMaterial from '../../LoadingMaterial'
import DynamicButtonInput from '../../Button/AddListElementButton'
import { sortListItemObjectByUpdatedDateDSC } from '@/components/Helpers'
import ListElement from './ListElement'
import { IBeneficiary, IElement } from '../../../../../types/types'

import useListData from '@/components/hooks/List/useListInitialData'
import { UseCheckAccessTokenHealth } from '@/components/hooks/Token/checkAccessTokenHealth'
import {
  addItemToListService,
  changeElementStatusService,
  suppressElementService,
  updateListElementService,
} from '@/components/hooks/List/useListDataManipulation'
import UseListSocket from '@/components/hooks/List/useListSocket'

export default function ListPage() {
  const params = useParams()
  const router = useRouter()
  const { checkToken } = UseCheckAccessTokenHealth()
  const listId = params?.listId as string | null
  const { listTop, listItems, setListItems } = useListData(listId)
  UseListSocket(setListItems)

  const [animateSuppressionByItemId, setAnimateSuppressionByItemId] = useState<
    string | null
  >(null)

  const listDetails = listTop ? listTop['app-lists'] : null

  const handleAddItemToList = useCallback(
    async (inputElement: string): Promise<boolean | null> => {
      try {
        const token = await checkToken()
        if (!token) {
          router.push('/login')
          return null
        }
        if (!listId || !listTop || !listDetails) return false

        const beneficiaries: IBeneficiary[] = listDetails.beneficiaries

        const { itemAdded } = await addItemToListService(
          listId,
          listDetails.listName,
          inputElement,
          beneficiaries,
        )

        if (listItems) {
          const updatedListUnsorted = [...listItems, itemAdded[0]]
          const liveElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === true)
            .sort(sortListItemObjectByUpdatedDateDSC)
          const crossedElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === false)
            .sort(sortListItemObjectByUpdatedDateDSC)

          const updatedItems = [...liveElementsSorted, ...crossedElementsSorted]
          setListItems(updatedItems)
        } else {
          setListItems(itemAdded)
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [listId, listDetails, listTop, listItems, setListItems, checkToken, router],
  )

  const handleUpdateElement = useCallback(
    async (
      updatedContent: string,
      elementId?: string,
      onSuccess?: () => void,
    ): Promise<boolean | null> => {
      try {
        const token = await checkToken()
        if (!token) {
          router.push('/login')
          return null
        }
        if (!listDetails) return false
        const beneficiaries: IBeneficiary[] = listDetails.beneficiaries
        const result = await updateListElementService(
          listDetails.listName,
          listDetails.id,
          updatedContent,
          beneficiaries,
          elementId,
        )
        // TODO : refacto the way I transform the data before displaying it
        if (elementId && listItems) {
          const otherElements = listItems.filter(
            (element) => element.id !== elementId,
          )
          if (result) {
            const newElement = result.data.itemContentChanged[0]
            const mergeElements = [...otherElements, newElement]

            const newLiveElementsSorted = mergeElements
              .filter((item) => item?.statusOpen === true)
              .sort(sortListItemObjectByUpdatedDateDSC)
            const newCrossedElementsSorted = mergeElements
              .filter((item) => item?.statusOpen === false)
              .sort(sortListItemObjectByUpdatedDateDSC)

            const newElements = [
              ...newLiveElementsSorted,
              ...newCrossedElementsSorted,
            ]
            if (onSuccess) {
              onSuccess()
            }

            setListItems(newElements)
          }
        }

        if (!result?.success) {
          throw new Error('Failed to modify item to list')
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [checkToken, listDetails, listItems, router, setListItems],
  )

  const handleSuppressElement = useCallback(
    async (item: string, id: string): Promise<boolean | null> => {
      try {
        const token = await checkToken()
        if (!token) {
          router.push('/login')
          return null
        }

        if (!listDetails) return false
        const beneficiaries: IBeneficiary[] = listDetails.beneficiaries

        const response = await suppressElementService(
          listDetails.listName,
          item,
          listId,
          id,
          beneficiaries,
        )

        if (response.success) {
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
    },
    [checkToken, listDetails, listItems, router, listId, setListItems],
  )

  const handleElementStatusChange = useCallback(
    async (id: string, changedElementName: string, statusOpen: boolean) => {
      try {
        const token = await checkToken()
        if (!token) {
          router.push('/login')
          return null
        }

        if (!listDetails) return false
        const beneficiaries: IBeneficiary[] = listDetails.beneficiaries
        if (listId) {
          const responseData = await changeElementStatusService(
            listDetails.listName,
            listId,
            id,
            changedElementName,
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
    },
    [listDetails, setListItems, listId, router, checkToken, listItems],
  )

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
          .sort(sortListItemObjectByUpdatedDateDSC)

        const newCrossedElementsSorted = updatedListNotSorted
          .filter((item) => item.statusOpen === false)
          .sort(sortListItemObjectByUpdatedDateDSC)

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
        .sort(sortListItemObjectByUpdatedDateDSC)

      const newCrossedElementsSorted = updatedListNotSorted
        .filter((item) => item.statusOpen === false)
        .sort(sortListItemObjectByUpdatedDateDSC)

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

  return (
    <div className={classes['root']}>
      <div className={classes['list-item']}>
        <div className={classes['element']} key={listDetails?.id}>
          <ListCard
            id={listDetails?.id ? listDetails?.id : ''}
            listName={listDetails?.listName ? listDetails?.listName : ''}
            thematic={listDetails?.thematic}
            beneficiaries={listDetails?.beneficiaries.map(
              (beneficiary: any) => beneficiary,
            )}
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
              onElementSuppress={handleSuppressElement}
              id={element.id}
              animateSuppressionByItemId={
                animateSuppressionByItemId === element.id
              }
              statusOpen={element.statusOpen}
              onInputSubmit={handleUpdateElement}
            />
          )
        })}
      </div>
      <div className={classes['dynamic-button-input']}>
        <DynamicButtonInput onInputSubmit={handleAddItemToList} />
      </div>
    </div>
  )
}
