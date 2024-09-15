import Layout from '@/components/Elements/Layout'
import { LandingHeader } from '@/components/Elements/Headers/LandingHeader'
import classes from '../../login/classes.module.scss'
import PasswordCreationForm from '@/components/Elements/Forms/PasswordCreationForm'

export default function AddPassword2() {
  return (
    <Layout pageType="register">
      <div className={classes['root']}>
        <div className={classes['top']}>
          <LandingHeader />
        </div>
        <div className={classes['content']}>
          <h3 className={classes['subtitle']}>Créez votre profil</h3>
          <PasswordCreationForm />
        </div>
      </div>
    </Layout>
  )
}
