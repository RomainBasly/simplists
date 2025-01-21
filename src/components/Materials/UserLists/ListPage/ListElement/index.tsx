'use client'
import React, { useRef, useState, useEffect } from 'react'
import classes from './classes.module.scss'
import classNames from 'classnames'
import {
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { getErrorMessage } from '@/Services/errorHandlingService'
import EditListForm from '@/components/Elements/Forms/EditListForm'

type IProps = {
  id: string
  content: string
  statusOpen: boolean
  animateSuppressionByItemId: boolean
  onElementSuppress: (item: string, id: string) => Promise<boolean | null>
  onCrossElement: (
    id: string,
    changedElementName: string,
    status: boolean,
  ) => Promise<boolean | null>
  onInputSubmit: (
    updatedContent: string,
    elementId?: string,
    onSuccess?: () => void,
  ) => Promise<boolean | null>
}

export default function ListElement(props: IProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [textContent, setTextContent] = useState<string>(props.content)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChoiceContainerOpen, setIsChoiceContainerOpen] = useState<boolean>(
    false,
  )
  const [errors, setErrors] = useState<{ [key: string]: string }>()
  const [isEditing, setIsEditing] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTextContent(props.content)
  }, [props.content])

  useEffect(() => {
    const clickOutside = async (event: MouseEvent | TouchEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        if (textContent !== props.content) {
          try {
            const success = await props.onInputSubmit(
              textContent,
              props.id,
              () => {
                setIsEditing(false)
                setTextContent(textContent)
              },
            )
            if (!success) {
              setErrors({ ...errors, form: 'Failed to save changes.' })
            }
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            setErrors({ ...errors, form: errorMessage })
          }
        } else {
          setIsEditing(false)
        }
        setIsEditing(false)
        setIsChoiceContainerOpen(false)
      } else if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsSelected(false)
        setIsChoiceContainerOpen(false)
      }
    }
    if (isEditing || isSelected) {
      document.addEventListener('click', clickOutside, true)
      document.addEventListener('touchstart', clickOutside, true)
    } else {
      document.removeEventListener('click', clickOutside, true)
      document.removeEventListener('touchstart', clickOutside, true)
    }

    return () => {
      document.removeEventListener('click', clickOutside, true)
      document.removeEventListener('touchstart', clickOutside, true)
    }
  }, [isEditing, isSelected, errors, props, textContent])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSelected(false)
        setIsChoiceContainerOpen(false)
        setIsEditing(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClickOnRootDiv = async () => {
    // check if this if is really necessary
    if (isChoiceContainerOpen) {
      return
    }

    if (!isSelected) {
      setIsSelected(!isSelected)
    } else if (isSelected) {
      await handleCrossElement()
    }
  }

  const handleCrossElement = async () => {
    try {
      const trigger = await props.onCrossElement(
        props.id,
        props.content,
        props.statusOpen,
      )
      if (trigger) {
        setIsChoiceContainerOpen(false)
        setIsSelected(false)
      }
    } catch (error) {
      // Todo : add error for that problem
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  function handleEditMode(event: React.MouseEvent) {
    event.stopPropagation()
    // setIsEditing(true)
    setIsEditing(!isEditing)
    // setIsSelected(true)
    setIsSelected(isSelected)
    setIsChoiceContainerOpen(false)
  }

  const isTextContentVisible = !isEditing

  function openChoiceContainer(event: React.MouseEvent) {
    event.stopPropagation()
    setIsChoiceContainerOpen(!isChoiceContainerOpen)
  }

  async function suppressElement(item: string, id: string) {
    try {
      await props.onElementSuppress(item, id)
    } catch (error) {
      // Todo : add error for that problem
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  const onInputChange = (newText: string) => {
    setTextContent(newText)
  }

  return (
    <div
      className={classNames(classes['root'], {
        [classes['is-selected']]: isSelected,
        [classes['blurred']]: !isSelected && isChoiceContainerOpen,
        [classes['is-suppressing']]: props.animateSuppressionByItemId,
        [classes['is-editing-container']]: isEditing,
      })}
      onClick={handleClickOnRootDiv}
      ref={elementRef}
    >
      {isChoiceContainerOpen && <div className={classes['blur-overlay']}></div>}
      {!isLoading && (
        <div className={classes['circle']}>
          <div
            className={classNames(classes['circle-selected'], {
              [classes['is-selected']]: isSelected,
              [classes['is-crossed']]: !props.statusOpen,
            })}
          ></div>
        </div>
      )}
      <div
        className={classNames(classes['text-container'], {
          [classes['is-editing']]: isEditing,
        })}
      >
        {isTextContentVisible && (
          <div
            className={classNames(classes['text'], {
              [classes['is-crossed']]: !props.statusOpen,
            })}
          >
            {textContent}
          </div>
        )}
        {!isTextContentVisible && (
          <EditListForm
            onInputSubmit={props.onInputSubmit}
            isEditing={isEditing}
            type={'edit-element'}
            content={props.content}
            ref={inputRef}
            id={props.id}
            handleEditing={() => setIsEditing(!isEditing)}
            onInputChange={onInputChange}
          />
        )}
      </div>
      {isSelected && !isEditing && (
        <div className={classes['icon']} onClick={openChoiceContainer}>
          <EllipsisHorizontalIcon className={classes['svg']} />
        </div>
      )}
      <div
        className={classNames(classes['choice-container'], {
          [classes['open']]:
            isChoiceContainerOpen && !props.animateSuppressionByItemId,
        })}
      >
        {props.statusOpen && (
          <div className={classes['choice']} onClick={handleEditMode}>
            Editer
          </div>
        )}
        <div className={classes['choice']} onClick={handleCrossElement}>
          <div className={classes['text']}>
            {!props.statusOpen ? "Décocher l'élément" : "Barrer l'élement"}
          </div>
        </div>
        {!props.statusOpen && (
          <div
            className={classes['choice']}
            onClick={() => suppressElement(props.content, props.id)}
          >
            <ExclamationTriangleIcon className={classes['svg']} />
            <div className={classes['text']}>Supprimer l'élement</div>
          </div>
        )}
      </div>
    </div>
  )
}
