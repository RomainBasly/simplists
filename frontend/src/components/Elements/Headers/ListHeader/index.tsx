'use client'
import { useRouter } from 'next/navigation'
import classes from './classes.module.scss'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import NavLink from '@/components/Materials/NavLink'
import classNames from 'classnames'

type IProps = {
  className: string
}

export default function ListHeader(props: Readonly<IProps>) {
  const router = useRouter()

  function navigate(url: string) {
    router.push(url)
  }
  return (
    <div className={classNames(classes['root'], props.className)}>
      <NavLink
        svg={<ArrowLeftIcon />}
        url={'/'}
        className={classes['nav-link']}
        svgClassName={classes['svg-class']}
        alt={'Retour à la page principale'}
        onClick={() => navigate('/')}
      />
    </div>
  )
}
