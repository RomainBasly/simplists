'use client'
import { LandingHeader } from '@/components/Elements/Headers/LandingHeader'
import React, { useEffect, useState } from 'react'
import classes from '../classes.module.scss'
import { Loader } from '@/components/Elements/Loader'
import { useRouter } from 'next/navigation'

export default function Transition() {
  const router = useRouter()
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
      <div className={classes['top']}>
        <LandingHeader />
      </div>
      <div className={classes['content']}>
        <Loader variant="page" />
      </div>
    </div>
  )
}
