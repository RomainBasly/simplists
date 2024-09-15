'use client'
import React from 'react'
import classes from './classes.module.scss'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  CheckCircleIcon,
  UserIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import classnames from 'classnames'
import Button from '../../Button'

type IProps = {
  key: number
  creatorName: string
  creatorEmail: string
  invitationId: string
  listId: string
  listName: string
  description?: string
  onAccept: (
    invitationId: string,
    listId: string,
    status: number,
  ) => Promise<void>
  thematic: string
  onRefuse?: (invitationId: string, listId: string, status: number) => void
  acceptButtonText?: string
  isMasked?: boolean
}

export default function InvitationCard(props: IProps) {
  function setAccept(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    props.onAccept(props.invitationId, props.listId, 2)
  }

  function setReject(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    props.onRefuse && props.onRefuse(props.invitationId, props.listId, 3)
  }

  function formatTitle(listName: string): string {
    const firstLetter = listName[0].toUpperCase()
    let restOfLetters: string = ''
    for (let i = 1; i < listName.length; i++) {
      restOfLetters += listName[i].toLowerCase()
    }

    return firstLetter + restOfLetters
  }

  return (
    <div className={classes['root']}>
      <div className={classes['content']}>
        <div className={classes['header']}>
          <div className={classes['thematic']}>{props.thematic}</div>
          <div className={classes['text']}>
            <span className={classes['emphasis-right']}>
              {formatTitle(props.listName)}
            </span>
          </div>
        </div>
        {props.description && (
          <div className={classes['text-unit']}>
            <div className={classes['unit-header']}>
              <BookOpenIcon className={classes['icon']} />
              <div className={classes['description-text']}>Description</div>
            </div>
            <div className={classes['text-content']}>{props.description}</div>
          </div>
        )}
        <div className={classes['text-unit']}>
          <div className={classes['unit-header']}>
            <UserIcon className={classes['icon']} />
            <div className={classes['author-text']}>Auteur</div>
          </div>
          <div className={classes['text-content']}>
            {props.creatorName} - {props.creatorEmail}
          </div>
        </div>
        <div className={classes['decision-buttons']}>
          <Button
            text={props.acceptButtonText ? props.acceptButtonText : 'Accepter'}
            className={classnames(classes['button-accept'])}
            textColor={classes['text-color']}
            leftIcon={<CheckCircleIcon className={classes['icon-accept']} />}
            onClick={setAccept}
          ></Button>
          {!props.isMasked && (
            <Button
              text={'Refuser'}
              className={classnames(classes['button-refuse'])}
              leftIcon={<XMarkIcon className={classes['icon']} />}
              onClick={setReject}
            />
          )}
        </div>
      </div>
    </div>
  )
}
