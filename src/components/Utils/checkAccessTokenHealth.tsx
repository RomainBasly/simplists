import { useState, useEffect, useCallback } from 'react'
import useTokenService from './tokenService'

export const useCheckAccessTokenHealth = () => {
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
