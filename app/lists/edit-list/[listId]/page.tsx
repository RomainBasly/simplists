import Layout from '@/components/Elements/Layout'
import classes from './classes.module.scss'
import CreateOrUpdateFormContainer from '@/components/Elements/CreateOrUpdateFormContainer'

export default async function EditList() {
  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <div className={classes['content']}>
          <h2 className={classes['subtitle']}>Editer la liste</h2>
          <CreateOrUpdateFormContainer />
        </div>
      </div>
    </Layout>
  )
}
