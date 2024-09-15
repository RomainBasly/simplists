import LoadingMaterial from '@/components/Materials/LoadingMaterial'
import classes from './classes.module.scss'

type IProps = {
  variant?: string
}

export function Loader(props: IProps) {
  return (
    <div className={classes['root']}>
      <LoadingMaterial />
      {props.variant === 'page' && (
        <div className={classes['loader-content']}>
          <p className={classes['charge']}>Chargement en cours...</p>
          <p className={classes['blocked']}>
            Si vous êtes bloqués ici, rafraîchissez votre page
          </p>
        </div>
      )}
    </div>
  )
}
