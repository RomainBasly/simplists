import { headers } from 'next/headers'
import Header from '../Headers/TopHeader'
import SideMenu from '../SideMenu'

import dynamic from 'next/dynamic'
import classes from './classes.module.scss'
import ListHeader from '../Headers/ListHeader'

export type ILayoutProps = {
  children: React.ReactNode
  pageType?: string
}

export default function Layout({ children, pageType }: ILayoutProps) {
  const NetworkStatusNotifierWithNoSSR = dynamic(
    () => import('@/components/Materials/NetworkStatusNotifier'),
    { ssr: false }, // This disables server-side rendering for the component
  )

  const nonce = headers().get('x-nonce')
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <meta name="x-nonce" content={nonce ?? 'default-nonce'} />
      {pageType !== 'login' && pageType !== 'register' && pageType !== 'list' && (
        <div className={classes['root']}>
          <Header className={classes['header']} />
          <SideMenu />
          <div className={classes['layout-content']}>
            {children}
            <NetworkStatusNotifierWithNoSSR
              className={classes['internet-notifier']}
            />
          </div>
        </div>
      )}
      {pageType === 'list' && (
        <div className={classes['root']}>
        <ListHeader className={classes['header']} />
        <div className={classes['layout-content']}>
          {children}
          <NetworkStatusNotifierWithNoSSR
            className={classes['internet-notifier']}
          />
        </div>
      </div>
      )}
      {(pageType === 'login' || pageType === 'register') && (
        <div className={classes['root']}>
          <div className={classes['layout-content']}>{children}</div>
        </div>
      )}
    </>
  )
}
