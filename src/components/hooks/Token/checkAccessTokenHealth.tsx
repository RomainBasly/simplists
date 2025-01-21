'use client'
import { useState, useEffect, useCallback } from 'react'
import useTokenService from './useTokenService'

export const UseCheckAccessTokenHealth = () => {
  const { checkAndRefreshAccessToken } = useTokenService()
  const [token, setToken] = useState<string | null>(null)

  const checkToken = useCallback(async () => {
    const token = await checkAndRefreshAccessToken()
    setToken(token)
    return token
  }, [checkAndRefreshAccessToken])

  useEffect(() => {
    checkToken()
  }, [checkToken])

  return { token, checkToken }
}
