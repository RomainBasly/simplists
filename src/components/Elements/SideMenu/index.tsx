'use client'
import * as React from 'react'
import { useCallback, useEffect } from 'react'
import classes from './classes.module.scss'
import UserMenuStatus, { EOpeningState } from '@/Stores/UserMenuStatus'
import {
  HomeIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  FolderPlusIcon,
  FlagIcon,
  BellAlertIcon,
} from '@heroicons/react/24/solid'
import NavLink from '@/components/Materials/NavLink'
import AuthenticationApi from '@/api/BackComponents/AuthenticationApi'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useUserInfo } from '@/components/providers/user-info-provider'
import { getSocket } from '../Socket'
import { useInvitationsInfo as useInvitations } from '@/components/providers/invitations-provider'
import { useNotificationsContext } from '@/components/providers/notifications-provider'

type IProps = {
  status?: EOpeningState
}

export default function SideMenu(props: IProps) {
  const router = useRouter()
  const { userAttributes } = useUserInfo()
  const [openingState, setOpeningState] = React.useState<EOpeningState>(
    UserMenuStatus.getInstance().status,
  )
  const socket = getSocket()
  const { invitationsNotificationsNumber } = useInvitations()

  const { liveNotificationNumber } = useNotificationsContext()

  const updateStatus = useCallback(() => {
    UserMenuStatus.getInstance().toggle()
  }, [])

  useEffect(() => {
    const removeOnStatusChange = UserMenuStatus.getInstance().onChange(
      userMenuStatusChangeListener,
    )
    return () => {
      removeOnStatusChange()
    }
  }, [updateStatus, openingState, props])

  function userMenuStatusChangeListener() {
    setOpeningState(UserMenuStatus.getInstance().status)
  }

  function close() {
    UserMenuStatus.getInstance().toggle()
  }

  async function disconnectUser() {
    try {
      const userId = userAttributes.userId
      const response = await AuthenticationApi.getInstance().disconnect(userId)
      if (response.status === 'ok') {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        router.push(response.redirectUrl)
      }
      const socketId = localStorage.getItem('socketId')
      socket.emit('unregister-user-id', {
        socketId,
      })
    } catch (error) {
      console.log(error)
    }
  }

  function navigate(url: string) {
    router.push(url)
    close()
  }

  const rootProps = { status: openingState }
  return (
    <div className={classes['root']} {...rootProps}>
      <XMarkIcon className={classes['closing-svg']} onClick={close} />
      <div className={classes['nav-link-container']}>
        <NavLink
          svg={<HomeIcon />}
          className={classes['nav-link']}
          text={"Page d'accueil"}
          alt={"Icône vers la page d'accueil"}
          onClick={() => {
            navigate('/home')
          }}
        />
        <NavLink
          svg={<FolderPlusIcon />}
          url={'/lists/create-list'}
          className={classes['nav-link']}
          text={'Créer une liste'}
          alt={'Icône créer une liste'}
          onClick={() => navigate('/lists/create-list')}
        />
        <div className={classes['invitations-container']}>
          <NavLink
            svg={<FlagIcon />}
            className={classes['nav-link']}
            text={'Mes invitations reçues'}
            alt={'Icône vers la page des invitations'}
            onClick={() => navigate('/invitations')}
          />

          <div className={classes['number-container']}>
            <div className={classes['number']}>
              {invitationsNotificationsNumber}
            </div>
          </div>
        </div>
        <div className={classes['notifications-container']}>
          <NavLink
            svg={<BellAlertIcon />}
            className={classes['nav-link']}
            text={'Notifications'}
            alt={'Icône vers la page des notifications'}
            onClick={() => navigate('/notifications')}
          />

          <div className={classes['number-container']}>
            <div className={classes['number']}>{liveNotificationNumber}</div>
          </div>
        </div>
        {/* TO DO - dev a profile page */}
        {/* <NavLink
          svg={<UserCircleIcon />}
          className={classes['nav-link']}
          text={'Profil'}
          alt={'Icône vers la page profil'}
          onClick={() => navigate('/profile')}
        /> */}
        <NavLink
          svg={<ArrowRightOnRectangleIcon />}
          className={classes['nav-link']}
          text={'Se déconnecter'}
          alt={'Icône se déconnecter'}
          onClick={disconnectUser}
        />
      </div>
    </div>
  )
}
