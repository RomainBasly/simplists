import React from 'react'
import classes from './classes.module.scss'
import { Loader } from '../../Elements/Loader'
import classNames from 'classnames'

type IProps = {
  text: string
  textColor?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  isLoading?: boolean
  className?: string
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  disabled?: boolean
}

const Button = React.memo(function Button(props: IProps) {
  return (
    <button
      className={classNames(classes['root'], props.className)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className={classes['loader-wrapper']}>
        {props.isLoading ? (
          <Loader />
        ) : (
          <div className={classes['left-icon']}>{props.leftIcon}</div>
        )}
      </div>
      <div className={classNames(classes['content'], props.textColor)}>
        {props.text}
      </div>
      {props.rightIcon && (
        <div className={classes['right-icon']}>{props.rightIcon}</div>
      )}
    </button>
  )
})

export default Button
