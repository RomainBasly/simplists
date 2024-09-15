'use client'
import classes from './classes.module.scss'
import React, { useCallback, useEffect, useState } from 'react'
import NavLink from '@/components/Materials/NavLink'
import Logo from '@/components/Materials/Logo'

import logo from '/public/images/logos/logo-big-screen.png'
import logoSmall from '/public/images/logos/logo-256x256.png'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  FlagIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/solid'
import UserMenuStatus, { EOpeningState } from '@/Stores/UserMenuStatus'
import { useRouter } from 'next/navigation'
import classnames from 'classnames'
import AuthenticationApi from '@/api/BackComponents/AuthenticationApi'
import Cookies from 'js-cookie'
import { useUserInfo } from '@/components/providers/user-info-provider'

type IProps = {
  className: string
}

export default function Header(props: IProps) {
  const router = useRouter()
  const { userAttributes } = useUserInfo()
  const [userMenuState, setUserMenuState] = React.useState<EOpeningState>(
    UserMenuStatus.getInstance().status,
  )

  const updateStatus = useCallback((status: EOpeningState) => {
    setUserMenuState(status)
  }, [])

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
      console.log('userId disconnection', userId)
      const response = await AuthenticationApi.getInstance().disconnect(userId)
      if (response.status === 'ok') {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userId')
        router.push(response.redirectUrl)
      }
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
          svg={<FlagIcon />}
          className={classes['nav-link']}
          text={'Mes invitations reçues'}
          alt={'Icône vers la page des invitations'}
          onClick={() => navigate('/invitations')}
        />
        <NavLink
          svg={<FolderPlusIcon />}
          url={'/lists/create-list'}
          className={classes['nav-link']}
          text={'Créer une liste'}
          alt={'Icône créer une liste'}
          onClick={() => navigate('/lists/create-list')}
        />
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
          onclick={redirectAndCloseSideMenu} // nothing happens
          width={50}
          height={50}
        />
        <Bars3Icon
          className={classes['burger-icon']}
          onClick={toggleUserMenu}
        />
      </div>
    </div>
  )
}
