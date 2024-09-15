'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

type IProps = {
  src: string
  alt: string
  className: string
  onclick?: () => void
  width: number
  height: number
}

export default function Logo(props: Readonly<IProps>) {
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
    <Image
      src={String(props.src)}
      alt={props.alt}
      className={props.className}
      onClick={props.onclick}
      // TODO : this following part will be erased for production
      width={props.width}
      height={props.height}
      loading="lazy"
      nonce={nonce}
    />
  )
}
