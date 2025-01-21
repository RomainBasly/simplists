import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'
import Script from 'next/script'
import { headers } from 'next/headers'
import ServiceWorkerInitiator from '@/components/Elements/ServiceWorkerInitiator'
import { SocketProvider } from '@/components/providers/socket-provider'
import { UserInfoProvider } from '@/components/providers/user-info-provider'
import { InvitationsInfoProvider } from '@/components/providers/invitations-provider'
import { NotificationsProvider } from '@/components/providers/notifications-provider'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = "Simp'listes"
const APP_DEFAULT_TITLE = "Simp'listes - nice and clean"
const APP_TITLE_TEMPLATE = "%s - Simp'listes"
const APP_DESCRIPTION = 'Simplifiez vous la gestion de vos listes'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = headers().get('x-nonce')
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SocketProvider>
          <NotificationsProvider>
            <InvitationsInfoProvider>
              <UserInfoProvider>{children}</UserInfoProvider>
            </InvitationsInfoProvider>
          </NotificationsProvider>
        </SocketProvider>
      </body>
      <Script strategy="afterInteractive" nonce={nonce ?? 'nothing'} />
      <ServiceWorkerInitiator />
    </html>
  )
}
