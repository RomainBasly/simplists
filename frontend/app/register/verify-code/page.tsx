import Layout from '@/components/Elements/Layout'
import SendCodeVerificationForm from '@/components/Elements/Forms/SendCodeVerificationForm'
import { LandingHeader } from '@/components/Elements/Headers/LandingHeader'
import classes from '../../login/classes.module.scss'

export default function VerifyEmail() {
  return (
    <Layout pageType="register">
      <div className={classes['root']}>
        <div className={classes['top']}>
          <LandingHeader />
        </div>
        <SendCodeVerificationForm />
      </div>
    </Layout>
  )
}
