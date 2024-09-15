'use client'
import Logo from '@/components/Materials/Logo'
import picture from '/public/images/logos/logo-big-screen.png'
import classes from './classes.module.scss'
import { useState, useEffect } from 'react'

export function LandingHeader() {
  const [nonce, setNonce] = useState<string>('')

  useEffect(() => {
    const styleNonce = document
      .querySelector('meta[name="x-nonce"]')
      ?.getAttribute('content')
    if (styleNonce) {
      setNonce(styleNonce)
    }
  }, [nonce])
  return (
    <div className={classes['root']}>
      <Logo
        src={String(picture.src)}
        alt={'Logo'}
        className={classes['logo']}
        width={1018}
        height={374}
      />
    </div>
  )
}
