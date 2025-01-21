import classNames from 'classnames'
import classes from './classes.module.scss'

type IProps = {
  svg: React.ReactElement
  className?: string
  svgClassName?: string
  text?: string
  alt: string
  url?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}

export default function NavLink(props: IProps) {
  return (
    <div
      className={classNames(classes['root'], props.className)}
      onClick={props.onClick}
    >
      <div className={classNames(classes['svg'], props.svgClassName)}>
        {props.svg}
      </div>
      <div className={classes['text']}>{props.text}</div>
    </div>
  )
}
