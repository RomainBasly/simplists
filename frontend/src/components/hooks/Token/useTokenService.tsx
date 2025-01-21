'use client'
import StorageService from '@/Services/CookieService'
import JwtService from '@/Services/jwtService'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

const useTokenService = () => {
  const Router = useRouter()

  const checkAndRefreshAccessToken = useCallback(async () => {
    const accessToken = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')

    if (!refreshToken) {
      Router.push('/login')
      return null
    }

    if (
      accessToken &&
      !JwtService.getInstance().isTokenExpired(accessToken, 5)
    ) {
      return accessToken
    }

    const isRefreshTokenExpired = JwtService.getInstance().isTokenExpired(
      refreshToken,
      30,
    )
    if (isRefreshTokenExpired) {
      Router.push('/login')
      return null
    }

    try {
      const response = await fetch(`/api/token/getNewAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      })
      const result = await response.json()

      StorageService.getInstance().setCookies(
        'accessToken',
        result.accessToken.accessToken,
        true,
      )
      return result.accessToken.accessToken
    } catch (error) {
      Router.push('/login')
      throw error
    }
  }, [Router])
  return { checkAndRefreshAccessToken }
}

export default useTokenService
