'use client'
import React, { useState, useEffect } from 'react'
import classes from './classes.module.scss'

export default function LoadingMaterial() {
  const [nonce, setNonce] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      const styleNonce = document
        .querySelector('meta[name="x-nonce"]')
        ?.getAttribute('content')
      if (styleNonce) {
        setNonce(styleNonce)
      }
    })()
  }, [nonce])

  return (
    <div className={classes['root']} nonce={nonce}>
      <svg className={classes['rotating-circle']} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="80%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: '#2a5293', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: 'transparent', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="url(#grad1)"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
