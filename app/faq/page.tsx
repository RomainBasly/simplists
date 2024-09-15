import classes from './classes.module.scss'
import { LandingHeader } from '@/components/Elements/Headers/LandingHeader'
import Layout from '@/components/Elements/Layout'
import FAQ from '@/components/Materials/FAQ'
// import SocketConnector from '@/components/Materials/SocketConnector'

export default function FAQPage() {
  return (
    <Layout pageType="register">
      <div className={classes['root']}>
        <div className={classes['top']}>
          <LandingHeader />
        </div>
        <div className={classes['content']}>
          <h3 className={classes['subtitle']}>Foire Aux Questions</h3>
          <FAQ />
        </div>
      </div>
      {/* <SocketConnector /> */}
    </Layout>
  )
}
