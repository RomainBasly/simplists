import React, { memo } from 'react'
import classes from './classes.module.scss'
import {
  Square3Stack3DIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

import classNames from 'classnames'
import { INotification } from '../types'
import { formatToReadableDate } from '@/components/Utils/common'

function SingleNotification({
  notification,
  onMarkAsRead,
  onDelete,
  animateSuppressionByNotificationId,
  onRootClick,
}: Readonly<{
  notification: INotification
  onMarkAsRead: (id: number, isNew: boolean) => void
  onDelete: (id: number) => void
  animateSuppressionByNotificationId: boolean
  onRootClick: (url: string) => void
}>) {
  const toggleIsRead = (event: React.MouseEvent) => {
    event.stopPropagation()
    onMarkAsRead(notification.id, !notification.isNew)
  }

  const onSuppress = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete(notification.id)
  }

  const renderIcon = () => {
    if (notification.type === 'suppression') {
      return (
        <TrashIcon
          className={classNames(classes['svg'], classes['suppression'])}
        />
      )
    }
    if (notification.type === 'addition') {
      return (
        <Square3Stack3DIcon
          className={classNames(classes['svg'], classes['addition'])}
        />
      )
    }
    return null
  }
  return (
    <div
      className={classNames(classes['root'], {
        [classes['is-new']]: notification.isNew,
        [classes['is-suppressing']]: animateSuppressionByNotificationId,
      })}
      onClick={() => onRootClick(notification.url)}
    >
      {notification.isNew && (
        <div className={classes['new-tag-container']}>
          <div className={classes['text-tag']}>Nouveau!</div>
        </div>
      )}
      <div className={classes['icon-wrapper']}>{renderIcon()}</div>
      <div className={classes['text-wrapper']}>
        <div className={classes['notification-content']}>
          {notification.content}
        </div>
        <div className={classes['notification-date']}>
          {formatToReadableDate(notification.updated_at)}
        </div>
      </div>
      <div className={classes['actions-wrapper']}>
        {notification.isNew && (
          <CheckCircleIcon
            className={classNames(classes['read-action'], {
              [classes['is-not-read']]: notification.isNew,
            })}
            onClick={(e) => toggleIsRead(e)}
            aria-label="Mark as read"
          />
        )}
        {!notification.isNew && (
          <CheckIcon
            className={classNames(classes['read-action'], {
              [classes['is-not-read']]: notification.isNew,
            })}
            onClick={(e) => toggleIsRead(e)}
            aria-label="Mark as read"
          />
        )}
        <XMarkIcon
          onClick={(e) => onSuppress(e)}
          className={classes['action-div']}
        />
      </div>
    </div>
  )
}

export default memo(SingleNotification)
