import Layout from '@/components/Elements/Layout'
import classes from './classes.module.scss'
import NotificationsList from '@/components/Materials/NotificationsList'

// const initialNotificationList = [
//   {
//     id: 1,
//     list_id: 'XXXX-XXXX-XXXX',
//     type: 'suppression',
//     isNew: true,
//     content: 'XX a supprimé XX de la liste XX',
//     updated_at: '2025-01-02T13:21:39.344',
//   },
//   {
//     id: 2,
//     list_id: 'XXXX-XXXX-XXXX',
//     type: 'suppression',
//     isNew: true,
//     content: 'XX a supprimé la liste XX',
//     updated_at: '2025-01-03T13:21:39.344',
//   },
//   {
//     id: 3,
//     list_id: 'XXXX-XXXX-XXXX',
//     type: 'addition',
//     isNew: false,
//     content: 'XX a ajouté XX à la liste XX',
//     updated_at: '2025-01-04T13:21:39.344',
//   },
// ]

export default function Notifications() {
  return (
    <Layout pageType="default">
      <div className={classes['root']}>
        <NotificationsList />
      </div>
    </Layout>
  )
}
