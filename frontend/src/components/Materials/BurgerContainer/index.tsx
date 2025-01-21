import { Bars3Icon } from '@heroicons/react/24/solid'
import classes from './classes.module.scss'
import React from 'react'
import classNames from 'classnames'
import { useInvitationsInfo } from '@/components/providers/invitations-provider'
import { useNotificationsContext } from '@/components/providers/notifications-provider'

type IProps = {
  toggleUserMenu: () => void
  classname: string
}

export default function BurgerContainer(props: Readonly<IProps>) {
  const { pendingInvitations } = useInvitationsInfo()
  const { liveNotificationNumber } = useNotificationsContext()

  const invitationsNotifications = pendingInvitations.length
  const notifications = invitationsNotifications + liveNotificationNumber

  return (
    <div className={classNames(classes['root'], props.classname)}>
      <Bars3Icon
        className={classes['burger-icon']}
        onClick={props.toggleUserMenu}
      />

      <div className={classes['number-container']}>
        <div className={classes['number']}>{notifications}</div>
      </div>
    </div>
  )
}
