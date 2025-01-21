'use client'
import classes from './classes.module.scss'
import React, { useCallback, useEffect } from 'react'
import NavLink from '@/components/Materials/NavLink'
import Logo from '@/components/Materials/Logo'

import logo from '/public/images/logos/logo-big-screen.png'
import logoSmall from '/public/images/logos/logo-256x256.png'
import {
  ArrowRightOnRectangleIcon,
  BellAlertIcon,
  FlagIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/solid'
import UserMenuStatus, { EOpeningState } from '@/Stores/UserMenuStatus'
import { useRouter } from 'next/navigation'
import classnames from 'classnames'
import AuthenticationApi from '@/api/BackComponents/AuthenticationApi'
import Cookies from 'js-cookie'
import { useUserInfo } from '@/components/providers/user-info-provider'
import BurgerContainer from '@/components/Materials/BurgerContainer'
import { getSocket } from '../../Socket'
import { useInvitationsInfo } from '@/components/providers/invitations-provider'
import { useNotificationsContext } from '@/components/providers/notifications-provider'

type IProps = {
  className: string
}

export default function Header(props: IProps) {
  const router = useRouter()
  const { userAttributes } = useUserInfo()
  const [userMenuState, setUserMenuState] = React.useState<EOpeningState>(
    UserMenuStatus.getInstance().status,
  )

  const { pendingInvitations } = useInvitationsInfo()
  const { liveNotificationNumber } = useNotificationsContext()

  const invitationsNotifications = pendingInvitations.length

  const updateStatus = useCallback((status: EOpeningState) => {
    setUserMenuState(status)
  }, [])
  const socket = getSocket()

  useEffect(() => {
    const removeOnUserMenuStatusChange = UserMenuStatus.getInstance().onChange(
      updateStatus,
    )
    return () => {
      removeOnUserMenuStatusChange()
    }
  }, [updateStatus])

  function toggleUserMenu() {
    UserMenuStatus.getInstance().toggle()
  }

  function navigate(url: string) {
    router.push(url)
  }

  async function disconnectUser() {
    try {
      const userId = userAttributes.userId
      const response = await AuthenticationApi.getInstance().disconnect(userId)
      if (response.status === 'ok') {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userId')
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

  function redirectAndCloseSideMenu() {
    UserMenuStatus.getInstance().close()
    navigate('/home')
  }

  return (
    <div className={classnames(classes['root'], props.className)}>
      <Logo
        src={String(logo.src)}
        alt={'Logo'}
        className={classes['logo-big-screen']}
        onclick={redirectAndCloseSideMenu}
        width={1018}
        height={374}
      />
      <div className={classes['big-screen-nav-links']}>
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
            <div className={classes['number']}>{invitationsNotifications}</div>
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
      <div className={classes['mobile']}>
        <Logo
          src={String(logoSmall.src)}
          alt={'Logo'}
          className={classes['logo-mobile']}
          onclick={redirectAndCloseSideMenu}
          width={50}
          height={50}
        />
        <BurgerContainer
          toggleUserMenu={toggleUserMenu}
          classname={classes['burger']}
        />
      </div>
    </div>
  )
}
