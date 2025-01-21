'use client'
import JwtService from '@/Services/jwtService'
import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { JWTPayload } from '../../../types/types'

const UserInfoContext = createContext<any>({
  userId: null,
})

export const useUserInfo = () => {
  return useContext(UserInfoContext)
}

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [userAttributes, setUserAttributes] = useState<{
    userId: string | null
  }>({ userId: null })

  useEffect(() => {
    const accessTokenCookie = Cookies.get('accessToken')
    if (accessTokenCookie) {
      const decoded = JwtService.getInstance().decodeJwt(accessTokenCookie)
      if (decoded) {
        const decodedAccessToken = (decoded as unknown) as JWTPayload
        const userId = decodedAccessToken.userInfo.id
        if (userId) {
          setUserAttributes({ userId: userId.toString() })
        }
      } else {
        console.error('failed to decode JWT at some point in UserInfoProvider')
      }
    }
  }, [])

  const contextValue = useMemo(() => ({ userAttributes }), [userAttributes])

  return (
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  )
}
