import classes from './classes.module.scss'

type IProps = {
  svg: React.ReactElement
  className?: string
  text: string
  alt: string
  url?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}

export default function NavLink(props: IProps) {
  return (
    <div className={classes['root']} onClick={props.onClick}>
      <div className={classes['svg']}>{props.svg}</div>
      <div className={classes['text']}>{props.text}</div>
    </div>
  )
}
